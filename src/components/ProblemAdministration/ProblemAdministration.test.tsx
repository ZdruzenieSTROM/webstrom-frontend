import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockRouter from 'next-router-mock'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import {apiAxios} from '@/api/apiAxios'
import {makeProblem, makeSolution, mockProblemFetch, renderWithProviders} from '@/utils/testUtils'

import {ProblemAdministration} from './ProblemAdministration'

const aliceFixture = makeSolution({
  id: 1,
  score: 5,
  semester_registration: {profile: {first_name: 'Alice', last_name: 'A'}} as never,
})

const bobFixture = makeSolution({
  id: 2,
  score: 3,
  semester_registration: {profile: {first_name: 'Bob', last_name: 'B'}} as never,
})

const baselineProblem = makeProblem({solution_set: [aliceFixture, bobFixture]})

describe('ProblemAdministration', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl({
      pathname: '/matik/admin/opravovanie/[[...params]]',
      query: {params: ['1']},
    })
    mockProblemFetch({problem: baselineProblem})
  })

  it('renders solution rows', async () => {
    renderWithProviders(<ProblemAdministration />)

    expect(await screen.findByText(/Opravovanie 1\. úlohy/)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Alice A')).toBeInTheDocument()
      expect(screen.getByText('Bob B')).toBeInTheDocument()
    })
  })

  it('keeps the save button disabled until a score is edited', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProblemAdministration />)

    const saveButton = await screen.findByRole('button', {name: /Uložiť body/})
    expect(saveButton).toBeDisabled()

    const inputs = screen.getAllByRole('textbox')
    await user.clear(inputs[0])
    await user.type(inputs[0], '7')
    expect(saveButton).toBeEnabled()

    // Reverting to the saved value re-disables the button.
    await user.clear(inputs[0])
    await user.type(inputs[0], '5')
    expect(saveButton).toBeDisabled()
  })

  it('marks an edited row as dirty (non-bold) and leaves other rows bold', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProblemAdministration />)

    const inputs = await screen.findAllByRole('textbox')
    // Default sort: name asc → Alice, Bob
    const aliceInput = inputs[0]
    const bobInput = inputs[1]

    // MUI sx renders as CSS class; computed fontWeight is '700' for bold.
    expect(aliceInput).toHaveStyle({fontWeight: '700'})
    expect(bobInput).toHaveStyle({fontWeight: '700'})

    await user.clear(aliceInput)
    await user.type(aliceInput, '7')

    expect(aliceInput).toHaveStyle({fontWeight: 'normal'})
    expect(bobInput).toHaveStyle({fontWeight: '700'})
  })

  it('clears dirty state when an edited score is reverted to the saved value', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProblemAdministration />)

    const inputs = await screen.findAllByRole('textbox')
    const aliceInput = inputs[0]

    await user.clear(aliceInput)
    await user.type(aliceInput, '7')
    expect(aliceInput).toHaveStyle({fontWeight: 'normal'})

    await user.clear(aliceInput)
    await user.type(aliceInput, '5')
    expect(aliceInput).toHaveStyle({fontWeight: '700'})
  })

  it('sorts by saved score, not by draft score, so editing does not reorder', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProblemAdministration />)

    await screen.findByText('Alice A')

    await user.click(screen.getByRole('button', {name: /Body/}))
    // Now sorted by points desc: Alice (5), Bob (3)
    let inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('5')
    expect(inputs[1]).toHaveValue('3')

    // Editing Alice's score must not reorder her — sort uses baseline (5), not draft.
    await user.clear(inputs[0])
    await user.type(inputs[0], '1')
    inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('1')
    expect(inputs[1]).toHaveValue('3')
  })

  it('saves merged scores, clears dirty state on success, and refetches', async () => {
    const user = userEvent.setup()
    vi.mocked(apiAxios.post).mockResolvedValue({data: {}} as never)

    renderWithProviders(<ProblemAdministration />)

    const inputs = await screen.findAllByRole('textbox')
    await user.clear(inputs[0])
    await user.type(inputs[0], '7')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})

    // Server-confirmed state after save: Alice's score is now 7. Set this BEFORE the
    // save click so the refetch (fired from onSuccess) returns the updated baseline.
    mockProblemFetch({
      problem: makeProblem({solution_set: [{...aliceFixture, score: 7}, bobFixture]}),
    })

    await user.click(screen.getByRole('button', {name: /Uložiť body/}))

    await waitFor(() => {
      expect(apiAxios.post).toHaveBeenCalledWith(
        '/competition/problem-administration/1/upload-points',
        expect.objectContaining({
          solution_set: expect.arrayContaining([expect.objectContaining({id: 1, score: 7})]),
        }),
      )
    })

    await waitFor(() => {
      expect(inputs[0]).toHaveStyle({fontWeight: '700'})
    })
  })

  it('preserves dirty edits and spinner-feedback through file upload and refetch', async () => {
    const user = userEvent.setup()

    let resolvePost!: (value: {data: unknown}) => void
    vi.mocked(apiAxios.post).mockImplementation(
      () =>
        new Promise<{data: unknown}>((resolve) => {
          resolvePost = resolve
        }) as never,
    )

    renderWithProviders(<ProblemAdministration />)

    const inputs = await screen.findAllByRole('textbox')
    // Edit Alice score 5 → 9.
    await user.clear(inputs[0])
    await user.type(inputs[0], '9')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})
    expect(inputs[0]).toHaveValue('9')

    // Upload a file on Bob's solution row.
    const bobUploader = screen.getByTestId('upload-solution-2')
    const bobFileInput = within(bobUploader).getByDisplayValue('')
    const file = new File(['x'], 'bob.pdf', {type: 'application/pdf'})
    await user.upload(bobFileInput, file)

    // POST in-flight: spinner is present.
    await waitFor(() => {
      expect(within(bobUploader).getByRole('progressbar')).toBeInTheDocument()
    })

    // Alice's dirty edit survives the in-flight POST.
    expect(inputs[0]).toHaveValue('9')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})

    // Server now has Bob's solution populated. Update GET mock before resolving POST.
    mockProblemFetch({
      problem: makeProblem({solution_set: [aliceFixture, {...bobFixture, solution: '/files/bob.pdf'}]}),
    })

    resolvePost({data: {}})

    // After refetch: spinner gone, Alice's draft still preserved.
    await waitFor(() => {
      expect(within(bobUploader).queryByRole('progressbar')).not.toBeInTheDocument()
    })
    expect(inputs[0]).toHaveValue('9')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})
  })
})

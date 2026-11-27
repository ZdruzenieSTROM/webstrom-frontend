import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import {beforeEach, describe, expect, it} from 'vitest'

import {apiUrl, createSession, makeAccount} from '@/test-utils/api'
import {makeProblemWithSolutions, makeSemesterWithProblems, makeSolutionAdministration} from '@/test-utils/fixtures'
import {renderApp} from '@/test-utils/render'
import {server} from '@/test-utils/server'
import {ProblemWithSolutions, SolutionAdministration} from '@/types/api/competition'

import {ProblemAdministration} from './ProblemAdministration'

const aliceFixture = makeSolutionAdministration({
  id: 1,
  score: 5,
  semester_registration: {profile: {first_name: 'Alice', last_name: 'A'}} as never,
})

const bobFixture = makeSolutionAdministration({
  id: 2,
  score: 3,
  semester_registration: {profile: {first_name: 'Bob', last_name: 'B'}} as never,
})

// What the backend currently stores for problem 1; handlers below read and update it.
let storedProblem: ProblemWithSolutions

const renderWithProviders = (ui: Parameters<typeof renderApp>[0]) =>
  renderApp(ui, {route: {pathname: '/matik/admin/opravit-ulohu/[[...params]]', query: {params: ['1']}}})

describe('ProblemAdministration', () => {
  beforeEach(() => {
    storedProblem = makeProblemWithSolutions({solution_set: [aliceFixture, bobFixture]})

    const matikGrader = makeAccount({
      permissions: {is_staff: true, is_superuser: false, competition_permissions: [1]},
    })

    server.use(
      ...createSession({account: matikGrader, signedIn: true}).handlers,
      http.get(apiUrl('/competition/problem-administration/1/'), () => HttpResponse.json(storedProblem)),
      http.get(apiUrl('/competition/semester/20/'), () => HttpResponse.json(makeSemesterWithProblems())),
    )
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
    server.use(
      http.post(apiUrl('/competition/problem-administration/1/upload-points/'), async ({request}) => {
        const {solution_set: solutionSet} = (await request.json()) as {solution_set: SolutionAdministration[]}
        storedProblem = {...storedProblem, solution_set: solutionSet}
        return HttpResponse.json({})
      }),
    )

    renderWithProviders(<ProblemAdministration />)

    const inputs = await screen.findAllByRole('textbox')
    await user.clear(inputs[0])
    await user.type(inputs[0], '7')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})

    await user.click(screen.getByRole('button', {name: /Uložiť body/}))

    expect(await screen.findByText('Body boli úspešne uložené.')).toBeInTheDocument()
    // The row turns clean again only when the refetched baseline equals the draft,
    // i.e. the backend stored the edited score for Alice and kept Bob's.
    await waitFor(() => {
      expect(inputs[0]).toHaveStyle({fontWeight: '700'})
    })
    expect(storedProblem.solution_set.map(({id, score}) => ({id, score}))).toStrictEqual([
      {id: 1, score: 7},
      {id: 2, score: 3},
    ])
  })

  it('preserves dirty edits and spinner-feedback through file upload and refetch', async () => {
    const user = userEvent.setup()

    let finishUpload!: () => void
    const uploadFinished = new Promise<void>((resolve) => {
      finishUpload = resolve
    })
    server.use(
      http.post(apiUrl('/competition/solution/2/upload-solution-file/'), async () => {
        await uploadFinished
        storedProblem = {
          ...storedProblem,
          solution_set: [aliceFixture, {...bobFixture, solution: '/files/bob.pdf'}],
        }
        return HttpResponse.json({})
      }),
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

    finishUpload()

    // After refetch: spinner gone, Alice's draft still preserved.
    await waitFor(() => {
      expect(within(bobUploader).queryByRole('progressbar')).not.toBeInTheDocument()
    })
    expect(inputs[0]).toHaveValue('9')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})
  })
})

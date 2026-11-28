import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AxiosError} from 'axios'
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

const getZipInput = async () => {
  await screen.findByText(/Opravovanie 1\. úlohy/)
  const input = document.querySelector<HTMLInputElement>('input[type="file"][accept*=".zip"]')
  if (!input) throw new Error('ZIP dropzone input not found')
  return input
}

const rejectWith = (data: unknown) =>
  vi.mocked(apiAxios.post).mockRejectedValue(
    new AxiosError('Request failed with status code 400', '400', undefined, undefined, {
      status: 400,
      data,
    } as never),
  )

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
    vi.mocked(apiAxios.post).mockResolvedValue({data: {}})

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

  it('lets a negative score be typed and saves it', async () => {
    const user = userEvent.setup()
    vi.mocked(apiAxios.post).mockResolvedValue({data: {}})

    renderWithProviders(<ProblemAdministration />)

    const inputs = await screen.findAllByRole('textbox')
    await user.clear(inputs[0])
    await user.type(inputs[0], '-')
    // A lone minus stays in the field while the digit is still to come
    expect(inputs[0]).toHaveValue('-')

    await user.type(inputs[0], '3')
    expect(inputs[0]).toHaveValue('-3')
    expect(inputs[0]).toHaveStyle({fontWeight: 'normal'})

    await user.click(screen.getByRole('button', {name: /Uložiť body/}))

    await waitFor(() => {
      expect(apiAxios.post).toHaveBeenCalledWith(
        '/competition/problem-administration/1/upload-points',
        expect.objectContaining({
          solution_set: expect.arrayContaining([expect.objectContaining({id: 1, score: -3})]),
        }),
      )
    })
  })

  it('shows a saved negative score and sorts it below positive ones', async () => {
    const user = userEvent.setup()
    mockProblemFetch({problem: makeProblem({solution_set: [{...aliceFixture, score: -2}, bobFixture]})})

    renderWithProviders(<ProblemAdministration />)

    await screen.findByText('Alice A')
    await user.click(screen.getByRole('button', {name: /Body/}))

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).toHaveValue('3')
    expect(inputs[1]).toHaveValue('-2')
    expect(inputs[1]).toHaveStyle({fontWeight: '700'})
  })

  it('preserves dirty edits and spinner-feedback through file upload and refetch', async () => {
    const user = userEvent.setup()

    let resolvePost!: (value: {data: unknown}) => void
    vi.mocked(apiAxios.post).mockImplementation(
      () =>
        new Promise<{data: unknown}>((resolve) => {
          resolvePost = resolve
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
    expect(apiAxios.post).toHaveBeenCalledWith('/competition/solution/2/upload-solution-file', expect.any(FormData))

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

  describe('corrected solutions ZIP upload', () => {
    const zipFile = new File(['zip'], 'opravene.zip', {type: 'application/zip'})

    it('posts the ZIP and shows how many solutions were uploaded and which files were skipped', async () => {
      const user = userEvent.setup()
      vi.mocked(apiAxios.post).mockResolvedValue({
        data: {
          uploaded: [{filename: '5-AliceA-1-10.pdf', solution_id: 1, score: 5}],
          errors: [],
          skipped: [{filename: 'poznamky.txt', reason: 'Nie je PDF, preskočené.'}],
        },
      })
      renderWithProviders(<ProblemAdministration />)

      await user.upload(await getZipInput(), zipFile)

      expect(apiAxios.post).toHaveBeenCalledWith('/competition/problem/1/upload-corrected', expect.any(FormData))
      const result = await screen.findByTestId('upload-zip-result')
      expect(within(result).getByText('Nahraných opravených riešení: 1.')).toBeInTheDocument()
      expect(within(result).getByText('poznamky.txt')).toBeInTheDocument()
      expect(within(result).getByText(/Nie je PDF, preskočené\./)).toBeInTheDocument()
    })

    it('lists files that were not saved after a partial upload', async () => {
      const user = userEvent.setup()
      vi.mocked(apiAxios.post).mockResolvedValue({
        data: {
          uploaded: [{filename: '5-AliceA-1-10.pdf', solution_id: 1, score: 5}],
          errors: [{filename: '4-BobB-1-11.pdf', reason: 'Súbor má koncovku .pdf, ale jeho obsah nie je PDF.'}],
          skipped: [],
        },
      })
      renderWithProviders(<ProblemAdministration />)

      await user.upload(await getZipInput(), zipFile)

      const result = await screen.findByTestId('upload-zip-result')
      expect(within(result).getByText('Nahraných opravených riešení: 1.')).toBeInTheDocument()
      expect(within(result).getByText('Neuložené pre chybu:')).toBeInTheDocument()
      expect(within(result).getByText('4-BobB-1-11.pdf')).toBeInTheDocument()
      expect(within(result).getByText(/obsah nie je PDF/)).toBeInTheDocument()
    })

    it('lists every error even when two files have the same name', async () => {
      const user = userEvent.setup()
      const reason = 'Duplicitné riešenie - to isté riešenie je v súboroch "a.pdf", "a.pdf". Neuložil sa ani jeden.'
      rejectWith({
        detail: 'Nič sa neuložilo. Počet súborov s chybou: 2.',
        errors: [
          {filename: 'a.pdf', reason},
          {filename: 'a.pdf', reason},
        ],
        skipped: [],
      })
      renderWithProviders(<ProblemAdministration />)

      await user.upload(await getZipInput(), zipFile)

      const errors = await screen.findByTestId('upload-zip-errors')
      expect(within(errors).getAllByText('a.pdf')).toHaveLength(2)
    })

    it('shows every file error together with its reason', async () => {
      const user = userEvent.setup()
      rejectWith({
        detail: 'Nič sa neuložilo. Počet súborov s chybou: 2.',
        errors: [
          {
            filename: 'opravene/x-AliceA-1-10.pdf',
            reason: 'Prvá časť názvu (body) "x" musí byť celé číslo v rozsahu -9 až 9.',
          },
          {
            filename: '5-BobB-7-11.pdf',
            reason: 'Súbor patrí k úlohe s id 7, ale nahrávaš opravené riešenia k úlohe s id 1.',
          },
        ],
        skipped: [],
      })
      renderWithProviders(<ProblemAdministration />)

      await user.upload(await getZipInput(), zipFile)

      const errors = await screen.findByTestId('upload-zip-errors')
      expect(within(errors).getByText('Nič sa neuložilo. Počet súborov s chybou: 2.')).toBeInTheDocument()
      expect(within(errors).getByText('opravene/x-AliceA-1-10.pdf')).toBeInTheDocument()
      expect(within(errors).getByText(/Prvá časť názvu \(body\) "x"/)).toBeInTheDocument()
      expect(within(errors).getByText('5-BobB-7-11.pdf')).toBeInTheDocument()
      expect(within(errors).getByText(/patrí k úlohe s id 7/)).toBeInTheDocument()
    })

    it('explains when the ZIP contained no corrected solution at all', async () => {
      const user = userEvent.setup()
      rejectWith({
        detail: 'V ZIPe sa nenašlo žiadne opravené riešenie.',
        errors: [],
        skipped: [{filename: 'vnutorny.zip', reason: 'ZIP v ZIPe nie je podporovaný.'}],
      })
      renderWithProviders(<ProblemAdministration />)

      await user.upload(await getZipInput(), zipFile)

      const errors = await screen.findByTestId('upload-zip-errors')
      expect(within(errors).getByText('V ZIPe sa nenašlo žiadne opravené riešenie.')).toBeInTheDocument()
      expect(within(errors).getByText('vnutorny.zip')).toBeInTheDocument()
      expect(within(errors).getByText(/ZIP v ZIPe nie je podporovaný/)).toBeInTheDocument()
    })

    it('shows a generic message for errors without the upload error shape', async () => {
      const user = userEvent.setup()
      vi.mocked(apiAxios.post).mockRejectedValue(new AxiosError('Network Error'))
      renderWithProviders(<ProblemAdministration />)

      await user.upload(await getZipInput(), zipFile)

      expect(await screen.findByText('Nahranie ZIPu zlyhalo.')).toBeInTheDocument()
    })

    it('tells the user when the dropped file is not a ZIP and does not upload it', async () => {
      const user = userEvent.setup({applyAccept: false})
      renderWithProviders(<ProblemAdministration />)

      const pdf = new File(['pdf'], 'riesenie.pdf', {type: 'application/pdf'})
      await user.upload(await getZipInput(), pdf)

      expect(await screen.findByText(/Súbor riesenie\.pdf sa nedá nahrať/)).toBeInTheDocument()
      expect(apiAxios.post).not.toHaveBeenCalled()
    })
  })
})

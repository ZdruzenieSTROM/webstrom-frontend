import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import {describe, expect, it} from 'vitest'

import {apiUrl, createSession, makeAccount} from '@/test-utils/api'
import {
  makeProblem,
  makePublication,
  makeResult,
  makeSemester,
  makeSemesterWithProblems,
  makeSeries,
  makeSeriesWithProblems,
} from '@/test-utils/fixtures'
import {findDialog, renderApp} from '@/test-utils/render'
import {server} from '@/test-utils/server'
import {Publication, Result, SemesterWithProblems, SolutionShort} from '@/types/api/competition'

import {SemesterAdministration} from './SemesterAdministration'

const STROM = 0

const stromGrader = makeAccount({permissions: {is_staff: true, is_superuser: false, competition_permissions: [STROM]}})

type Upload = {method: string; fields: Record<string, string>}

/**
 * The backend as the STROM grading page sees it: semester 20 with series 30 and 31, the current one is 30.
 * Freezing, unfreezing and magazine uploads change the stored semester, which the page then refetches.
 */
const startBackend = ({
  account = stromGrader,
  semester = makeSemesterWithProblems({
    series_set: [makeSeriesWithProblems({id: 30, order: 1}), makeSeriesWithProblems({id: 31, order: 2})],
  }),
  freezeResponse,
  results = [],
}: {
  account?: typeof stromGrader
  semester?: SemesterWithProblems
  freezeResponse?: () => Response
  results?: Result[]
} = {}) => {
  let storedSemester = semester
  const frozenSeriesIds: number[] = []
  const uploads: Upload[] = []

  const setSeriesComplete = (seriesId: number, complete: boolean) => {
    storedSemester = {
      ...storedSemester,
      series_set: storedSemester.series_set.map((series) => (series.id === seriesId ? {...series, complete} : series)),
    }
  }

  const storePublication = async (request: Request, publication: Partial<Publication>) => {
    const body = await request.formData()
    const fields = Object.fromEntries(
      [...body.entries()].map(([key, value]) => [key, typeof value === 'string' ? value : value.name]),
    )
    uploads.push({method: request.method, fields})
    const stored = makePublication({...publication, name: fields.file, order: Number(fields.order)})
    storedSemester = {
      ...storedSemester,
      publication_set: [...storedSemester.publication_set.filter(({id}) => id !== stored.id), stored],
    }
    return HttpResponse.json(stored)
  }

  server.use(
    ...createSession({account, signedIn: true}).handlers,
    http.get(apiUrl('/competition/semester-list/'), () =>
      HttpResponse.json([makeSemester({series_set: [makeSeries({id: 30, order: 1}), makeSeries({id: 31, order: 2})]})]),
    ),
    http.get(apiUrl('/competition/series/current/0/'), () => HttpResponse.json(makeSeriesWithProblems({id: 30}))),
    http.get(apiUrl('/competition/semester/20/'), () => HttpResponse.json(storedSemester)),
    http.post(apiUrl('/competition/series/:seriesId/results/freeze/'), ({params}) => {
      if (freezeResponse) return freezeResponse()
      frozenSeriesIds.push(Number(params.seriesId))
      setSeriesComplete(Number(params.seriesId), true)
      return HttpResponse.json({})
    }),
    http.post(apiUrl('/competition/series/:seriesId/results/unfreeze/'), ({params}) => {
      setSeriesComplete(Number(params.seriesId), false)
      return HttpResponse.json({})
    }),
    http.get(apiUrl('/competition/semester/20/results/'), () => HttpResponse.json(results)),
    http.post(apiUrl('/competition/publication/'), ({request}) => storePublication(request, {id: 950})),
    http.patch(apiUrl('/competition/publication/:publicationId/'), ({request, params}) =>
      storePublication(request, {id: Number(params.publicationId)}),
    ),
  )

  return {frozenSeriesIds, uploads}
}

const renderGradingPage = async () => {
  renderApp(<SemesterAdministration />, {route: {pathname: '/strom/admin/opravovanie/[[...params]]', query: {}}})

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
}

const seriesHeader = (title: string) => within(screen.getByRole('heading', {name: title}).parentElement!)

// The open dialog hides the rest of the page from the accessibility tree until it finishes closing.
const confirm = async (user: ReturnType<typeof userEvent.setup>, dialog: Awaited<ReturnType<typeof findDialog>>) => {
  await user.click(dialog.getByRole('button', {name: 'Áno'}))
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
}

const magazineInput = (order: number) =>
  screen.getByText(`${order}. Časopis:`).parentElement!.querySelector<HTMLInputElement>('input[type="file"]')!

const pdf = (name: string) => new File(['%PDF-1.4'], name, {type: 'application/pdf'})

const points = (...values: string[]): SolutionShort[] =>
  values.map((value, index) => ({points: value, solution_pk: null, problem_pk: index, votes: 0}))

describe('grading a semester', () => {
  it('shows no grading data to a signed-in user without permission for this seminar', async () => {
    startBackend({
      account: makeAccount({permissions: {is_staff: true, is_superuser: false, competition_permissions: [1]}}),
    })
    await renderGradingPage()

    expect(screen.getByText('Nemáš oprávnenie na zobrazenie tejto stránky.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', {name: '1. séria'})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Uzavrieť sériu'})).not.toBeInTheDocument()
  })

  it('shows how many solutions of each problem are corrected and which problems lack a sample solution', async () => {
    startBackend({
      semester: makeSemesterWithProblems({
        series_set: [
          makeSeriesWithProblems({
            problems: [
              makeProblem({
                id: 101,
                order: 1,
                num_solutions: 3,
                num_corrected_solutions: 3,
                solution_pdf: '/media/vzoraky/1.pdf',
              }),
              makeProblem({id: 102, order: 2, num_solutions: 5, num_corrected_solutions: 2, solution_pdf: null}),
            ],
          }),
        ],
      }),
    })
    await renderGradingPage()

    expect(screen.getByRole('link', {name: '1. úloha'})).toHaveAttribute('href', '/strom/admin/opravit-ulohu/101')
    expect(screen.getByText('Opravené (3)')).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Vzorák'})).toHaveAttribute('href', '/media/vzoraky/1.pdf')
    expect(screen.getByRole('link', {name: '2. úloha'})).toHaveAttribute('href', '/strom/admin/opravit-ulohu/102')
    expect(screen.getByText('2/5')).toBeInTheDocument()
    expect(screen.getByText('chýba vzorák')).toBeInTheDocument()
  })

  it('closes the chosen series after confirmation', async () => {
    const user = userEvent.setup()
    const {frozenSeriesIds} = startBackend()
    await renderGradingPage()

    await user.click(seriesHeader('2. séria').getByRole('button', {name: 'Uzavrieť sériu'}))
    const dialog = await findDialog('Uzavretie série')
    expect(
      dialog.getByText(
        'Naozaj chceš uzavrieť túto sériu? Po uzavretí už nebude možné meniť výsledky riešiteľov v danej sérii.',
      ),
    ).toBeInTheDocument()
    await confirm(user, dialog)

    expect(await seriesHeader('2. séria').findByText('Séria je uzavretá')).toBeInTheDocument()
    expect(seriesHeader('2. séria').getByRole('button', {name: 'Otvoriť sériu'})).toBeInTheDocument()
    expect(seriesHeader('1. séria').getByText('Séria je otvorená')).toBeInTheDocument()
    expect(frozenSeriesIds).toStrictEqual([31])
  })

  it('reopens a closed series after confirmation', async () => {
    const user = userEvent.setup()
    startBackend({
      semester: makeSemesterWithProblems({series_set: [makeSeriesWithProblems({id: 30, order: 1, complete: true})]}),
    })
    await renderGradingPage()

    await user.click(seriesHeader('1. séria').getByRole('button', {name: 'Otvoriť sériu'}))
    const dialog = await findDialog('Otvorenie série')
    await confirm(user, dialog)

    expect(await seriesHeader('1. séria').findByText('Séria je otvorená')).toBeInTheDocument()
    expect(seriesHeader('1. séria').getByRole('button', {name: 'Uzavrieť sériu'})).toBeInTheDocument()
  })

  it("shows the backend's reason under the series that could not be closed", async () => {
    const user = userEvent.setup()
    const reason = 'Séria ešte nie je opravená.'
    startBackend({freezeResponse: () => HttpResponse.json({detail: reason}, {status: 405})})
    await renderGradingPage()

    await user.click(seriesHeader('2. séria').getByRole('button', {name: 'Uzavrieť sériu'}))
    const dialog = await findDialog('Uzavretie série')
    await confirm(user, dialog)

    expect(await seriesHeader('2. séria').findByText(reason)).toBeInTheDocument()
    expect(seriesHeader('2. séria').getByText('Séria je otvorená')).toBeInTheDocument()
    expect(seriesHeader('1. séria').queryByText(reason)).not.toBeInTheDocument()
  })

  it('generates the semester results as LaTeX table rows', async () => {
    const user = userEvent.setup()
    const registration = makeResult().registration
    startBackend({
      results: [
        makeResult({
          rank_start: 1,
          rank_end: 1,
          rank_changed: true,
          subtotal: [12, 9],
          total: 21,
          solutions: [points('4', '8'), points('5', '4')],
        }),
        makeResult({
          rank_start: 2,
          rank_end: 3,
          rank_changed: true,
          registration: {
            ...registration,
            profile: {id: 2, first_name: 'Peter', last_name: 'Novák'},
            grade: {id: 3, name: '8. ročník ZŠ', tag: 'Z8', years_until_graduation: 5},
          },
          subtotal: [10, 7],
          total: 17,
          solutions: [points('6', '4'), points('3', '4')],
        }),
        makeResult({
          rank_start: 2,
          rank_end: 3,
          rank_changed: false,
          registration: {...registration, profile: {id: 3, first_name: 'Eva', last_name: 'Malá'}},
          subtotal: [9, 8],
          total: 17,
          solutions: [points('5', '4'), points('4', '4')],
        }),
      ],
    })
    await renderGradingPage()

    await user.click(screen.getByRole('button', {name: 'Poradie semestra'}))

    // Columns: rank, name, school, grade, first series total, second series problems, semester total.
    // A tied participant after the first one of the tie gets no rank.
    expect(await screen.findByRole('textbox')).toHaveValue(
      [
        String.raw`1.&Jana Riešiteľová&GPoš&Z9&12&5&4&21\\`,
        String.raw`2.-3.&Peter Novák&GPoš&Z8&10&3&4&17\\`,
        String.raw`&Eva Malá&GPoš&Z9&9&4&4&17\\`,
      ].join('\n'),
    )
  })

  it('uploads the first magazine of a semester that has none and links it', async () => {
    const user = userEvent.setup()
    const {uploads} = startBackend()
    await renderGradingPage()

    await user.upload(magazineInput(1), pdf('casopis-1.pdf'))

    expect(await screen.findByRole('link', {name: 'casopis-1.pdf'})).toBeInTheDocument()
    expect(uploads).toStrictEqual([
      {method: 'POST', fields: {file: 'casopis-1.pdf', publication_type: '4', event: '20', order: '1'}},
    ])
  })

  it('replaces an already uploaded magazine', async () => {
    const user = userEvent.setup()
    const {uploads} = startBackend({
      semester: makeSemesterWithProblems({
        publication_set: [makePublication({id: 901, name: 'casopis-2.pdf', order: 2})],
      }),
    })
    await renderGradingPage()
    expect(screen.getByRole('link', {name: 'casopis-2.pdf'})).toBeInTheDocument()

    await user.upload(magazineInput(2), pdf('casopis-2-oprava.pdf'))

    expect(await screen.findByRole('link', {name: 'casopis-2-oprava.pdf'})).toBeInTheDocument()
    expect(screen.queryByRole('link', {name: 'casopis-2.pdf'})).not.toBeInTheDocument()
    expect(uploads).toStrictEqual([
      {method: 'PATCH', fields: {file: 'casopis-2-oprava.pdf', publication_type: '4', event: '20', order: '2'}},
    ])
  })
})

import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import {describe, expect, it} from 'vitest'

import {apiUrl, createSession} from '@/test-utils/api'
import {
  makeProblem,
  makeSemester,
  makeSemesterWithProblems,
  makeSeriesWithProblems,
  makeSubmittedSolution,
} from '@/test-utils/fixtures'
import {renderApp} from '@/test-utils/render'
import {server} from '@/test-utils/server'
import {Problem, SeriesWithProblems} from '@/types/api/competition'

import {Problems} from './Problems'

type Participant = {registered: boolean; submitted: Problem['submitted']}

/**
 * The backend as the current series page of STROM sees it: semester 20, series 30, one problem (101).
 * Like the real one, it reports registration and the submitted solution only to a signed-in user.
 */
const startBackend = ({
  signedIn,
  series = {},
  participant = {registered: false, submitted: null},
}: {
  signedIn: boolean
  series?: Partial<SeriesWithProblems>
  participant?: Participant
}) => {
  const session = createSession({signedIn})
  const state = {...participant}
  const uploadedFiles: string[] = []

  const currentSeries = () =>
    HttpResponse.json(
      makeSeriesWithProblems({
        is_registered: session.isSignedIn() && state.registered,
        problems: [makeProblem({submitted: session.isSignedIn() ? state.submitted : null})],
        ...series,
      }),
    )

  server.use(
    ...session.handlers,
    http.get(apiUrl('/competition/semester-list/'), () => HttpResponse.json([makeSemester()])),
    http.get(apiUrl('/competition/series/current/0/'), currentSeries),
    http.get(apiUrl('/competition/series/30/'), currentSeries),
    http.get(apiUrl('/competition/semester/20/'), () => HttpResponse.json(makeSemesterWithProblems())),
    http.post(apiUrl('/competition/event/20/register/'), () => {
      state.registered = true
      return new HttpResponse(null, {status: 201})
    }),
    http.post(apiUrl('/competition/problem/101/upload-solution/'), async ({request}) => {
      const body = await request.formData()
      const file = body.get('file')
      // Not `instanceof File`: the parsed body holds Node's File, while the global here is jsdom's.
      if (file === null || typeof file === 'string') return HttpResponse.json({detail: 'Chýba súbor.'}, {status: 400})
      uploadedFiles.push(file.name)
      state.submitted = makeSubmittedSolution()
      return new HttpResponse(null, {status: 201})
    }),
  )

  return {account: session.account, uploadedFiles}
}

const renderProblems = async () => {
  renderApp(<Problems />, {route: {pathname: '/strom/zadania/[[...params]]', query: {}}})

  await screen.findByRole('heading', {name: '1. ÚLOHA'})
  // The spinner covers both the data and the "is the visitor signed in" probe.
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
}

const findDialog = async (title: string) => {
  const heading = await screen.findByRole('heading', {name: title})
  return within(heading.closest<HTMLElement>('[role="dialog"]')!)
}

const submitButton = () => screen.getByRole('button', {name: 'odovzdať'})

const dropFile = async (user: ReturnType<typeof userEvent.setup>, file: File) => {
  await screen.findByText('Vlož riešenie vo formáte pdf')
  await user.upload(document.querySelector<HTMLInputElement>('input[type="file"]')!, file)
}

const pdf = () => new File(['%PDF-1.4'], 'riesenie.pdf', {type: 'application/pdf'})

describe('submitting a solution', () => {
  it('asks an anonymous visitor to sign in and continues as that user', async () => {
    const user = userEvent.setup()
    const {account} = startBackend({signedIn: false, participant: {registered: true, submitted: null}})
    await renderProblems()

    await user.click(submitButton())

    const loginDialog = await findDialog('Prihlásenie')
    expect(loginDialog.getByText('Pre odovzdanie sa prihlás.')).toBeInTheDocument()
    await user.type(loginDialog.getByLabelText('Email'), account.email)
    await user.type(loginDialog.getByLabelText('Heslo'), account.password)
    await user.click(loginDialog.getByRole('button', {name: 'Prihlásiť'}))

    // Links to one's own solutions are shown only to a signed-in, registered participant.
    expect(await screen.findByRole('link', {name: 'moje riešenie'})).toBeInTheDocument()
  })

  it('has a signed-in user confirm school and grade, then registers them to the semester', async () => {
    const user = userEvent.setup()
    startBackend({signedIn: true})
    await renderProblems()

    await user.click(submitButton())

    const registrationDialog = await findDialog('Kontrola údajov')
    expect(registrationDialog.getByText('Gymnázium, Poštová 9, Košice')).toBeInTheDocument()
    expect(registrationDialog.getByText('9. ročník ZŠ')).toBeInTheDocument()
    await user.click(registrationDialog.getByRole('button', {name: 'Údaje sú správne'}))

    expect(await screen.findByRole('link', {name: 'moje riešenie'})).toBeInTheDocument()
  })

  it('uploads the PDF after the honesty declaration and then offers the submitted solution', async () => {
    const user = userEvent.setup()
    const {uploadedFiles} = startBackend({signedIn: true, participant: {registered: true, submitted: null}})
    await renderProblems()
    expect(screen.getByRole('link', {name: 'moje riešenie'})).toHaveAttribute('aria-disabled', 'true')

    await user.click(submitButton())
    const declaration = await findDialog('Čestné prehlásenie')
    await user.click(declaration.getByRole('button', {name: 'Potvrdiť'}))
    await dropFile(user, pdf())

    expect(await screen.findByText('Riešenie úspešne nahrané.')).toBeInTheDocument()
    expect(uploadedFiles).toStrictEqual(['riesenie.pdf'])
    await waitFor(() => {
      expect(screen.getByRole('link', {name: 'moje riešenie', hidden: true})).toHaveAttribute(
        'href',
        '/api/competition/problem/101/my-solution',
      )
    })
  })

  it('uploads nothing when the honesty declaration is declined', async () => {
    const user = userEvent.setup()
    const {uploadedFiles} = startBackend({signedIn: true, participant: {registered: true, submitted: null}})
    await renderProblems()

    await user.click(submitButton())
    const declaration = await findDialog('Čestné prehlásenie')
    await user.click(declaration.getByRole('button', {name: 'Zrušiť'}))

    await waitFor(() => {
      expect(screen.queryByText('Vlož riešenie vo formáte pdf')).not.toBeInTheDocument()
    })
    expect(uploadedFiles).toStrictEqual([])
  })

  it('warns before overwriting an already submitted solution', async () => {
    const user = userEvent.setup()
    startBackend({
      signedIn: true,
      // Only resubmission is allowed - a first submission would be refused.
      series: {can_submit: false, can_resubmit: true},
      participant: {registered: true, submitted: makeSubmittedSolution()},
    })
    await renderProblems()

    await user.click(submitButton())
    const declaration = await findDialog('Čestné prehlásenie')
    await user.click(declaration.getByRole('button', {name: 'Potvrdiť'}))

    const warning = await findDialog('Pozor')
    expect(
      warning.getByText(
        'Nahraním nového riešenia prepíšeš svoje predošlé odovzdanie a pri hodnotení budeme zohľadnovať len toto nové riešenie.',
      ),
    ).toBeInTheDocument()
  })

  it('rejects a file that is not a PDF without sending it', async () => {
    // user-event would otherwise drop the file itself because of the input's `accept` attribute.
    const user = userEvent.setup({applyAccept: false})
    const {uploadedFiles} = startBackend({signedIn: true, participant: {registered: true, submitted: null}})
    await renderProblems()

    await user.click(submitButton())
    const declaration = await findDialog('Čestné prehlásenie')
    await user.click(declaration.getByRole('button', {name: 'Potvrdiť'}))
    await dropFile(user, new File(['text'], 'riesenie.docx', {type: 'application/msword'}))

    expect(await screen.findByText('Nahraný súbor musí byť vo formáte pdf.')).toBeInTheDocument()
    expect(uploadedFiles).toStrictEqual([])
  })

  it('disables submitting for a user who cannot participate in the competition', async () => {
    startBackend({signedIn: true, series: {can_participate: false}})
    await renderProblems()

    // The tooltip explaining why is the disabled button's accessible name.
    expect(
      screen.getByRole('button', {
        name: 'Tejto súťaže sa nemôžeš zúčastniť, pretože si vo vysokom ročníku. Ak ho máš nastavený zle, zmeň si ho v profile.',
      }),
    ).toBeDisabled()
  })

  it('does not offer submitting once the series no longer accepts solutions', async () => {
    startBackend({signedIn: true, series: {can_submit: false}, participant: {registered: true, submitted: null}})
    await renderProblems()

    expect(screen.queryByRole('button', {name: 'odovzdať'})).not.toBeInTheDocument()
  })
})

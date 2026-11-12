import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import {describe, expect, it} from 'vitest'

import {apiUrl, createSession, schoolPickerHandlers} from '@/test-utils/api'
import {findDialog, renderApp} from '@/test-utils/render'
import {server} from '@/test-utils/server'

import {VerifyEmail} from '../VerifyEmail/VerifyEmail'
import {RegisterForm} from './RegisterForm'

type User = ReturnType<typeof userEvent.setup>

const takenEmail = 'riesitel@example.com'

/** The backend refuses a second account for an e-mail it already knows, like the real one. */
const startBackend = () => {
  const registrations: {seminar: string | null; body: unknown}[] = []

  server.use(
    ...createSession({signedIn: false}).handlers,
    ...schoolPickerHandlers(),
    http.post(apiUrl('/user/registration/'), async ({request}) => {
      const body = (await request.json()) as {email: string}
      if (body.email === takenEmail) {
        return HttpResponse.json(
          {email: ['Používateľ s touto e-mailovou adresou už je zaregistrovaný.']},
          {status: 400},
        )
      }
      registrations.push({seminar: new URL(request.url).searchParams.get('seminar'), body})
      return HttpResponse.json({detail: 'Verifikačný e-mail bol odoslaný.'}, {status: 201})
    }),
  )

  return {registrations}
}

const pick = async (user: User, label: string, option: string) => {
  const combobox = screen.getByRole('combobox', {name: label})
  // The picker stays disabled until its options arrive from the backend.
  await waitFor(() => {
    expect(combobox).toBeEnabled()
  })
  await user.click(combobox)
  await user.click(await screen.findByRole('option', {name: option}))
}

const fillRegistration = async (user: User, email: string) => {
  await user.type(screen.getByLabelText('e-mail*'), email)
  await user.type(screen.getByLabelText('heslo*'), 'tajne-heslo-1')
  await user.type(screen.getByLabelText('potvrdenie hesla*'), 'tajne-heslo-1')
  await user.type(screen.getByLabelText('krstné meno*'), 'Jana')
  await user.type(screen.getByLabelText('priezvisko*'), 'Nováková')
  await pick(user, 'škola*', 'Gymnázium Poštová 9, Košice')
  await pick(user, 'ročník*', '9. ročník ZŠ')
  await user.type(screen.getByLabelText('telefón v tvare +421 ...'), '+421 900 123 456')
}

const renderRegistration = () => renderApp(<RegisterForm />, {route: '/strom/registracia'})

describe('registering', () => {
  it('registers the new user to the seminar and asks them to verify their e-mail', async () => {
    const user = userEvent.setup()
    const {registrations} = startBackend()
    renderRegistration()

    await fillRegistration(user, 'nova@example.com')
    await user.click(screen.getByRole('button', {name: 'Registrovať'}))

    const alert = await findDialog('Registrácia')
    expect(
      alert.getByText(
        'Verifikačný e-mail bol odoslaný na zadanú e-mailovú adresu. Ak ho do pár minút neuvidíš, skontroluj, či ti náhodou neprišiel do priečinku spam.',
      ),
    ).toBeInTheDocument()
    expect(registrations).toStrictEqual([
      {
        seminar: 'strom',
        body: {
          email: 'nova@example.com',
          password1: 'tajne-heslo-1',
          password2: 'tajne-heslo-1',
          profile: {
            first_name: 'Jana',
            last_name: 'Nováková',
            school: 100,
            phone: '+421900123456',
            parent_phone: '',
            grade: 4,
          },
          new_school_description: '',
        },
      },
    ])
  })

  it('shows why the backend refused the e-mail next to the e-mail field', async () => {
    const user = userEvent.setup()
    const {registrations} = startBackend()
    renderRegistration()

    await fillRegistration(user, takenEmail)
    await user.click(screen.getByRole('button', {name: 'Registrovať'}))

    expect(await screen.findByText('* Používateľ s touto e-mailovou adresou už je zaregistrovaný.')).toBeInTheDocument()
    expect(screen.getByLabelText('e-mail*')).toHaveAttribute('aria-invalid', 'true')
    expect(registrations).toStrictEqual([])
  })
})

describe('verifying the e-mail', () => {
  const verificationKey = 'MTI:1vXyZq:verify'

  const renderVerification = () =>
    renderApp(<VerifyEmail />, {
      route: {pathname: '/strom/verify-email/[verificationKey]', query: {verificationKey}},
    })

  it('verifies the e-mail with the key from the link and invites the user to sign in', async () => {
    const verifiedKeys: string[] = []
    server.use(
      ...createSession({signedIn: false}).handlers,
      http.post(apiUrl('/user/registration/verify-email/'), async ({request}) => {
        verifiedKeys.push(((await request.json()) as {key: string}).key)
        return HttpResponse.json({detail: 'ok'})
      }),
    )
    renderVerification()

    expect(await screen.findByText('Overenie emailu prebehlo úspešne. Môžeš sa prihlásiť.')).toBeInTheDocument()
    expect(verifiedKeys).toStrictEqual([verificationKey])
  })

  it('tells the user when the backend rejects the key', async () => {
    server.use(
      ...createSession({signedIn: false}).handlers,
      http.post(apiUrl('/user/registration/verify-email/'), () =>
        HttpResponse.json({detail: 'Neplatný kľúč.'}, {status: 404}),
      ),
    )
    renderVerification()

    expect(
      await screen.findByText(
        'Email už bol verifikovaný, alebo nastal iný problém. Skús sa prihlásiť a v prípade problémov skús overiť email znovu alebo nás kontaktuj.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('Overenie emailu prebehlo úspešne. Môžeš sa prihlásiť.')).not.toBeInTheDocument()
  })
})

import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import mockRouter from 'next-router-mock'
import {describe, expect, it} from 'vitest'

import {apiUrl, createSession} from '@/test-utils/api'
import {findDialog, renderApp} from '@/test-utils/render'
import {server} from '@/test-utils/server'

import {PasswordResetForm} from '../PasswordReset/PasswordReset'
import {BottomButtons} from './MenuMain/BottomButtons'

type User = ReturnType<typeof userEvent.setup>

const renderMenu = (route: string) => renderApp(<BottomButtons />, {route})

const signIn = async (user: User, {email, password}: {email: string; password: string}) => {
  const loginDialog = await findDialog('Prihlásenie')
  await user.type(loginDialog.getByLabelText('Email'), email)
  await user.type(loginDialog.getByLabelText('Heslo'), password)
  await user.click(loginDialog.getByRole('button', {name: 'Prihlásiť'}))
}

const waitForDialogsToClose = () =>
  waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

describe('signing in', () => {
  it('signs the user in with correct credentials and keeps them on the page', async () => {
    const user = userEvent.setup()
    const session = createSession({signedIn: false})
    server.use(...session.handlers)
    renderMenu('/strom/zadania')

    await user.click(screen.getByRole('button', {name: 'Prihlásiť'}))
    await signIn(user, session.account)

    expect(await screen.findByRole('button', {name: 'Odhlásiť'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Profil'})).toHaveAttribute('href', '/strom/profil')
    await waitForDialogsToClose()
    expect(mockRouter.asPath).toBe('/strom/zadania')
  })

  it('leaves the registration page for the seminar home page after signing in there', async () => {
    const user = userEvent.setup()
    const session = createSession({signedIn: false})
    server.use(...session.handlers)
    renderMenu('/strom/registracia')

    await user.click(screen.getByRole('button', {name: 'Prihlásiť'}))
    await signIn(user, session.account)

    await waitFor(() => {
      expect(mockRouter.asPath).toBe('/strom')
    })
    await waitForDialogsToClose()
    expect(screen.getByRole('button', {name: 'Odhlásiť'})).toBeInTheDocument()
  })

  it("shows the backend's reason when the credentials are wrong and stays signed out", async () => {
    const user = userEvent.setup()
    const session = createSession({signedIn: false})
    server.use(...session.handlers)
    renderMenu('/strom')

    await user.click(screen.getByRole('button', {name: 'Prihlásiť'}))
    await signIn(user, {email: session.account.email, password: 'zle-heslo'})

    const alert = await findDialog('Upozornenie')
    expect(alert.getByText('Zadané údaje nie sú správne.')).toBeInTheDocument()
    expect(session.isSignedIn()).toBe(false)
  })
})

describe('signing out', () => {
  it('signs the user out and leaves the profile page for the seminar home page', async () => {
    const user = userEvent.setup()
    const session = createSession({signedIn: true})
    server.use(...session.handlers)
    renderMenu('/strom/profil')

    await user.click(await screen.findByRole('button', {name: 'Odhlásiť'}))

    expect(await screen.findByRole('button', {name: 'Prihlásiť'})).toBeInTheDocument()
    expect(mockRouter.asPath).toBe('/strom')
    expect(session.isSignedIn()).toBe(false)
  })

  it('shows the user as signed out even when the backend fails to end the session', async () => {
    const user = userEvent.setup()
    const session = createSession({signedIn: true})
    // The first matching handler answers, so this one shadows the session's successful logout.
    server.use(
      http.post(apiUrl('/user/logout/'), () => HttpResponse.json(null, {status: 500})),
      ...session.handlers,
    )
    renderMenu('/strom')

    await user.click(await screen.findByRole('button', {name: 'Odhlásiť'}))

    expect(await screen.findByRole('button', {name: 'Prihlásiť', hidden: true})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Odhlásiť', hidden: true})).not.toBeInTheDocument()
    expect(session.isSignedIn()).toBe(true)
  })
})

describe('resetting a forgotten password', () => {
  it('sets the new password from the e-mailed link and lets the user sign in with it', async () => {
    const user = userEvent.setup()
    const session = createSession({signedIn: false})
    const confirmations: unknown[] = []
    server.use(
      ...session.handlers,
      http.post(apiUrl('/user/password/reset/confirm/'), async ({request}) => {
        const body = (await request.json()) as {new_password1: string}
        confirmations.push(body)
        session.account.password = body.new_password1
        return HttpResponse.json({detail: 'Heslo bolo zmenené.'})
      }),
    )
    renderApp(<PasswordResetForm uid="MQ" token="cz6f6x-reset" />, {
      route: {pathname: '/strom/reset-password/[...resetToken]', query: {resetToken: ['cz6f6x-reset', 'MQ']}},
    })

    await user.type(screen.getByLabelText('heslo*'), 'nove-heslo-123')
    await user.type(screen.getByLabelText('potvrdenie hesla*'), 'nove-heslo-123')
    await user.click(screen.getByRole('button', {name: 'Resetovať heslo'}))

    expect(await screen.findByText('Heslo úspešne zmenené, môžeš sa prihlásiť.')).toBeInTheDocument()
    expect(confirmations).toStrictEqual([
      {new_password1: 'nove-heslo-123', new_password2: 'nove-heslo-123', uid: 'MQ', token: 'cz6f6x-reset'},
    ])

    await user.type(screen.getByLabelText('Email'), session.account.email)
    await user.type(screen.getByLabelText('Heslo'), 'nove-heslo-123')
    await user.click(screen.getByRole('button', {name: 'Prihlásiť'}))

    await waitFor(() => {
      expect(mockRouter.asPath).toBe('/strom')
    })
    expect(session.isSignedIn()).toBe(true)
  })
})

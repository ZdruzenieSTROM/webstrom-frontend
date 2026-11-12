import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import mockRouter from 'next-router-mock'
import {describe, expect, it} from 'vitest'

import {apiUrl, createSession, schoolPickerHandlers} from '@/test-utils/api'
import {findDialog, renderApp} from '@/test-utils/render'
import {server} from '@/test-utils/server'

import {ProfileDetail} from './ProfileDetail'
import {ProfileForm} from './ProfileForm'

/** A signed-in user whose backend checks the current password the way the real one does. */
const startBackend = () => {
  const session = createSession({signedIn: true})
  const profileUpdates: unknown[] = []

  server.use(
    ...session.handlers,
    ...schoolPickerHandlers(),
    http.patch(apiUrl('/user/user/'), async ({request}) => {
      profileUpdates.push(await request.json())
      return HttpResponse.json({detail: 'ok'})
    }),
    http.post(apiUrl('/user/password/change/'), async ({request}) => {
      const body = (await request.json()) as {old_password: string; new_password1: string}
      if (body.old_password !== session.account.password) {
        return HttpResponse.json(
          {old_password: ['Vaše staré heslo bolo zadané nesprávne. Zadajte ho prosím znovu.']},
          {status: 400},
        )
      }
      session.account.password = body.new_password1
      return HttpResponse.json({detail: 'Nové heslo bolo uložené.'})
    }),
  )

  return {account: session.account, profileUpdates}
}

const changePassword = async (user: ReturnType<typeof userEvent.setup>, currentPassword: string) => {
  renderApp(<ProfileDetail />, {route: '/strom/profil'})

  await user.click(screen.getByRole('button', {name: 'Zmeniť heslo'}))
  const dialog = await findDialog('Zmena hesla')
  await user.type(dialog.getByLabelText('aktuálne heslo'), currentPassword)
  await user.type(dialog.getByLabelText('nové heslo'), 'nove-heslo-123')
  await user.type(dialog.getByLabelText('nové heslo znovu'), 'nove-heslo-123')
  await user.click(dialog.getByRole('button', {name: 'Potvrdiť'}))
}

describe('changing the password', () => {
  it('changes the password and closes the dialog', async () => {
    const user = userEvent.setup()
    const {account} = startBackend()

    await changePassword(user, account.password)

    const alert = await findDialog('Upozornenie')
    expect(alert.getByText('Zmena hesla prebehla úspešne.')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('heading', {name: 'Zmena hesla', hidden: true})).not.toBeInTheDocument()
    })
    expect(account.password).toBe('nove-heslo-123')
  })

  it('shows why the backend refused the current password next to its field', async () => {
    const user = userEvent.setup()
    const {account} = startBackend()

    await changePassword(user, 'zle-heslo')

    const dialog = await findDialog('Zmena hesla')
    expect(
      await dialog.findByText('* Vaše staré heslo bolo zadané nesprávne. Zadajte ho prosím znovu.'),
    ).toBeInTheDocument()
    expect(dialog.getByLabelText('aktuálne heslo')).toHaveAttribute('aria-invalid', 'true')
    expect(account.password).toBe('tajne-heslo')
  })
})

describe('editing the profile', () => {
  it('saves the changed contact and school details and returns to the profile', async () => {
    const user = userEvent.setup()
    const {profileUpdates} = startBackend()
    renderApp(<ProfileForm />, {route: '/strom/profil/uprava'})

    const grade = await screen.findByRole('combobox', {name: 'ročník*'})
    await waitFor(() => {
      expect(grade).toHaveValue('9. ročník ZŠ')
    })
    await user.click(grade)
    await user.click(await screen.findByRole('option', {name: '8. ročník ZŠ'}))
    await user.type(screen.getByLabelText('telefónne číslo'), '+421 900 123 456')
    await user.click(screen.getByRole('button', {name: 'Uložiť údaje'}))

    await waitFor(() => {
      expect(mockRouter.asPath).toBe('/strom/profil')
    })
    expect(profileUpdates).toStrictEqual([
      {
        profile: {school: 100, phone: '+421900123456', parent_phone: '', grade: 3},
        new_school_description: '',
      },
    ])
  })
})

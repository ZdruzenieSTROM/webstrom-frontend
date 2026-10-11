import {http, HttpResponse} from 'msw/http'

import {MyPermissions, Profile} from '@/types/api/personal'

import {makeProfile} from './fixtures'

// Handler paths are written the way the backend routes them (with the trailing slash),
// and with a wildcard origin because MSW in Node has no base URL for relative paths.
export const apiUrl = (path: string) => `*/api${path}`

export type Account = {
  email: string
  password: string
  profile: Profile
  permissions: MyPermissions
}

export const makeAccount = (overrides: Partial<Account> = {}): Account => ({
  email: 'riesitel@example.com',
  password: 'tajne-heslo',
  profile: makeProfile(),
  permissions: {is_staff: false, is_superuser: false, competition_permissions: []},
  ...overrides,
})

const forbidden = () => HttpResponse.json({detail: 'Nie ste prihlásený.'}, {status: 403})

/**
 * The backend's session behaviour: profile endpoints answer 403 until the account signs in.
 * `isSignedIn` lets flow-specific handlers return user-specific data the way the backend does.
 */
export const createSession = ({account = makeAccount(), signedIn}: {account?: Account; signedIn: boolean}) => {
  let active = signedIn

  const handlers = [
    http.get(apiUrl('/personal/profiles/mypermissions/'), () =>
      active ? HttpResponse.json(account.permissions) : forbidden(),
    ),
    http.get(apiUrl('/personal/profiles/myprofile/'), () =>
      active ? HttpResponse.json(account.profile) : forbidden(),
    ),
    http.post(apiUrl('/user/login/'), async ({request}) => {
      const credentials = (await request.json()) as {email?: string; password?: string}
      if (credentials.email !== account.email || credentials.password !== account.password) {
        return HttpResponse.json({non_field_errors: ['Zadané údaje nie sú správne.']}, {status: 400})
      }
      active = true
      return HttpResponse.json({key: 'token'})
    }),
    http.post(apiUrl('/user/logout/'), () => {
      active = false
      return HttpResponse.json({detail: 'Odhlásenie prebehlo úspešne.'})
    }),
  ]

  return {account, handlers, isSignedIn: () => active}
}

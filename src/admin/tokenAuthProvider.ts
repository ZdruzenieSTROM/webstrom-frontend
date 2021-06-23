import {AuthProvider, HttpError} from 'react-admin'
import {Cookies} from 'react-cookie'

const authTokenUrl = '/api/user/login/'
const cookies = new Cookies()

export const authProvider: AuthProvider = {
  login: async ({username, password}) => {
    const response = await fetch(authTokenUrl, {
      method: 'POST',
      body: JSON.stringify({email: username, password}),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
    if (response.ok) {
      cookies.set('webstrom-token', (await response.json()).key)
      return
    }
    if (response.headers.get('content-type') !== 'application/json') {
      throw new Error(response.statusText)
    }

    const json = await response.json()
    const error = json.non_field_errors
    throw new Error(error || response.statusText)
  },
  logout: () => {
    cookies.remove('webstrom-token')
    return Promise.resolve()
  },
  checkAuth: () =>
    cookies.get('webstrom-token')
      ? Promise.resolve()
      : Promise.reject(new HttpError('checkAuth: webstrom-token cookie is missing', 401)),
  checkError: (error) => {
    const status = error.status
    if (status === 401 || status === 403) {
      cookies.remove('webstrom-token')
      return Promise.reject(new HttpError(`checkError: unauthorized/forbidden request`, status))
    }
    return Promise.resolve()
  },
  getPermissions: () => {
    return Promise.resolve()
  },
}

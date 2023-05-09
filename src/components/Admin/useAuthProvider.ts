import {AuthProvider, HttpError} from 'react-admin'

import {AuthContainer, testAuth, testAuthRequest} from '@/utils/AuthContainer'

export const useAuthProvider = () => {
  const {loginAsync, logout} = AuthContainer.useContainer()

  const authProvider: AuthProvider = {
    login: async ({username, password}) => loginAsync({data: {email: username, password}}),
    logout: async () => logout(),
    checkAuth: async () => {
      await testAuthRequest()
    },
    checkError: async (error) => {
      // rovnaky handling ako v `responseIntercepto`r v `AuthContainer`
      const status = error.response?.status

      if (status === 403) {
        const success = await testAuth()
        if (!success) return Promise.reject(new HttpError(`checkError: unauthorized/forbidden request`, error))
      }

      return Promise.resolve()
    },
    getPermissions: () => {
      return Promise.resolve()
    },
  }

  return authProvider
}

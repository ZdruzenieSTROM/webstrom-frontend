import {useRouter} from 'next/router'
import {AuthProvider, HttpError} from 'react-admin'

import {AuthContainer, testAuth, testAuthRequest} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

export const useAuthProvider = () => {
  const {loginAsync, logoutAsync} = AuthContainer.useContainer()
  const router = useRouter()
  const {seminar} = useSeminarInfo()

  const authProvider: AuthProvider = {
    login: async ({username, password}) => loginAsync({data: {email: username, password}}),
    logout: async () => {
      await logoutAsync()
      router.push(`/${seminar}`)
    },
    checkAuth: async () => {
      await testAuthRequest()
    },
    checkError: async (error) => {
      // rovnaky handling ako v `responseInterceptor` v `AuthContainer`
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

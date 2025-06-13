import {useRouter} from 'next/router'
import {useMemo} from 'react'
import {AuthProvider, HttpError} from 'react-admin'

import {AuthContainer, testAuth} from '@/utils/AuthContainer'

export const useAuthProvider = () => {
  const {loginAsync, logoutAsync} = AuthContainer.useContainer()
  const router = useRouter()

  const authProvider: AuthProvider = useMemo(
    () => ({
      login: async ({username, password}) => loginAsync({data: {email: username, password}}),
      logout: async () => {
        await logoutAsync()
        router.push('/strom')
        return Promise.resolve()
      },
      checkAuth: async () => {
        // `checkAuth` should throw on auth error, but when it does, React Admin calls `logout`
        // and possibly causes infinite loop of `logout` calls.
        // we handle the auth in AuthContainer ourselves. `apiAxios` has interceptor that handles 403s.
        return Promise.resolve()
      },
      canAccess: async () => {
        // TODO: e.g. superadmin resources, or block viewing strom stuff for kricky admins
        return Promise.resolve(true)
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
    }),
    [loginAsync, logoutAsync, router],
  )

  return authProvider
}

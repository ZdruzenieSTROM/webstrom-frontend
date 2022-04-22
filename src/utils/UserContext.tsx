import axios, {AxiosError} from 'axios'
import React, {Dispatch, FC, SetStateAction, useContext, useEffect, useState} from 'react'
import {Cookies, useCookies} from 'react-cookie'

interface User {
  online: boolean
  first_name: string
  last_name: string
  nickname: string
  school: number
  phone: string
  parent_phone: string
  gdpr: boolean
  grade: number
  triggerUserUpdate: () => void
}
const emptyUser = {
  first_name: '',
  last_name: '',
  nickname: '',
  school: 0,
  phone: '',
  parent_phone: '',
  gdpr: false,
  grade: 0,
  online: false,
  triggerUserUpdate: () => {},
}

const UserContext = React.createContext(emptyUser)
const WebstromTokenContext = React.createContext('')
// ToDo: instead of union type, it would be better to use an empty dispatch function. If it is even possible.
const SetWebstromTokenContext = React.createContext<Dispatch<SetStateAction<string>> | ((arg: string) => void)>(
  (arg: string) => {},
)

const cookies = new Cookies()

export const useUser = () => {
  const user = useContext(UserContext)
  return user
}

export const useWebstromToken = () => {
  const webstromToken = useContext(WebstromTokenContext)
  return webstromToken
}

export const useSetWebstromToken = () => {
  const setWebstromToken = useContext(SetWebstromTokenContext)
  return setWebstromToken
}

export const UserProvider: FC = ({children}) => {
  const [user, setUser] = useState<User>(emptyUser)
  const [webstromToken, setWebstromToken] = useState('')
  const [, , removeCookie] = useCookies(['webstrom-token'])

  useEffect(() => {
    setWebstromToken(cookies.get('webstrom-token') || '')
  }, [])

  useEffect(() => {
    if (webstromToken !== '') {
      const requestInterceptor = axios.interceptors.request.use((request) => {
        // Interceptor ktorý pridá webstromToken do autorizačného headera

        request.headers.Authorization = `Token ${webstromToken}`

        return request
      })
      return () => {
        axios.interceptors.request.eject(requestInterceptor)
      }
    }
  }, [webstromToken])

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status

        if (status === 401 && webstromToken !== '') {
          // Nesprávny webstromToken vráti 401. V tomto prápade sa webstromToken zmaže
          // Uložia sa informácie o userovi, zruší sa autorizačný header a prepošle sa request.

          removeCookie('webstrom-token', {path: '/'})
          setWebstromToken('')

          const originalRequestConfig = error.config
          delete originalRequestConfig.headers.Authorization

          return axios.request(originalRequestConfig)
        }

        return Promise.reject(error)
      },
    )
    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webstromToken])

  // Fetch user info whenever cookies['webstrom-token'] change
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUser(emptyUser)
        const {data} = await axios.get<User>(`/api/personal/profiles/myprofile/`)
        setUser({...data, online: true, triggerUserUpdate: fetchUserInfo})
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        // setError(error)
      } finally {
        // setLoading(false)
      }
    }

    if (webstromToken === '') {
      setUser(emptyUser)
    } else {
      fetchUserInfo()
    }
  }, [webstromToken])

  return (
    <SetWebstromTokenContext.Provider value={setWebstromToken}>
      <WebstromTokenContext.Provider value={webstromToken}>
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
      </WebstromTokenContext.Provider>
    </SetWebstromTokenContext.Provider>
  )
}

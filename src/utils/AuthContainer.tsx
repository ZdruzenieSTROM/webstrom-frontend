import axios, {AxiosError} from 'axios'
import {useEffect, useState} from 'react'
import {Cookies, useCookies} from 'react-cookie'
import {createContainer} from 'unstated-next'

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
const emptyUser: User = {
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

const cookies = new Cookies()

// webstrom token global state
const useAuth = () => {
  const [, , removeCookie] = useCookies(['webstrom-token'])

  const [webstromToken, setWebstromToken] = useState(cookies.get('webstrom-token') || '')

  useEffect(() => {
    console.log('effect to add auth interceptor')
    if (webstromToken !== '') {
      // Interceptor ktorý pridá webstromToken do autorizačného headera
      const requestInterceptor = axios.interceptors.request.use((request) => {
        request.headers.Authorization = `Token ${webstromToken}`

        return request
      })
      return () => {
        axios.interceptors.request.eject(requestInterceptor)
      }
    }
  }, [webstromToken])

  useEffect(() => {
    console.log('effect to add removeCookie')
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status

        if (status === 401 && webstromToken !== '') {
          // Nesprávny webstromToken vráti 401. V tomto prápade sa webstromToken zmaže
          // Uložia sa informácie o userovi, zruší sa autorizačný header a prepošle sa request.

          console.log('clearing token')
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

  const [user, setUser] = useState(emptyUser)

  console.log(user, webstromToken)

  // Fetch user info whenever cookies['webstrom-token'] change
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('before my profile')
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

    console.log('user container effect')
    if (webstromToken === '') {
      console.log('setting user to empty')
      setUser(emptyUser)
    } else {
      fetchUserInfo()
    }
  }, [webstromToken])

  return {webstromToken, setWebstromToken, user}
}
export const AuthContainer = createContainer(useAuth)

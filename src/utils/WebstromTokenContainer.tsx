import axios, {AxiosError} from 'axios'
import {useEffect, useState} from 'react'
import {Cookies, useCookies} from 'react-cookie'
import {createContainer} from 'unstated-next'

const cookies = new Cookies()

// webstrom token global state
const useWebstromToken = () => {
  const [, , removeCookie] = useCookies(['webstrom-token'])

  const [webstromToken, setWebstromToken] = useState(cookies.get('webstrom-token') || '')

  useEffect(() => {
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

  return {webstromToken, setWebstromToken}
}
export const WebstromTokenContainer = createContainer(useWebstromToken)

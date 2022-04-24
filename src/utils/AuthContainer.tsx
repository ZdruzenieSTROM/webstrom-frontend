import axios, {AxiosError} from 'axios'
import {useEffect, useState} from 'react'
import {Cookies} from 'react-cookie'
import {createContainer} from 'unstated-next'

import {Login, Token} from '@/types/api/generated/user'

import {ProfileContainer} from './ProfileContainer'

const cookies = new Cookies()

const useAuth = () => {
  // stav, ktory napoveda, ci mame sessionid cookie a vieme robit auth requesty
  const [isAuthed, setIsAuthed] = useState(false)

  // AuthContainer teda musi byt child ProfieContaineru v _app.tsx
  const {fetchProfile, resetProfile} = ProfileContainer.useContainer()

  const testAuthAndLogin = () => {
    fetchProfile(() => setIsAuthed(true))
  }

  useEffect(() => {
    // zistime, ci ma user platne sessionid - request na nejaky autentikovany endpoint
    testAuthAndLogin()
    // one-time vec
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isAuthed) {
      // interceptor pre auth
      const requestInterceptor = axios.interceptors.request.use((request) => {
        // auth pozostava z comba:
        // 1. `sessionid` httpOnly cookie ktoru nastavuje aj maze server pri login/logout
        // 2. tato CSRF hlavicka, ktora ma obsahovat cookie, ktoru nastavuje server
        request.headers['X-CSRFToken'] = cookies.get('csrftoken')

        return request
      })
      return () => {
        axios.interceptors.request.eject(requestInterceptor)
      }
    }
  }, [isAuthed])

  useEffect(() => {
    // interceptor pre 401, ked by sme mali byt authed
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status

        // sessionid moze byt neaktualne alebo vadne - vráti to 401
        if (status === 401 && isAuthed) {
          // odhlasime usera z UI
          setIsAuthed(false)
          resetProfile()
        }

        return Promise.reject(error)
      },
    )
    // useEffect unmount callback
    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [isAuthed, resetProfile])

  const login = async (formData: Login, closeOverlay: () => void) => {
    try {
      // the server should set sessionid cookie here automatically
      await axios.post<Token>('/api/user/login/', formData)

      setIsAuthed(true)
      closeOverlay()

      // fetchProfile ma vlastny error handling, necrashne
      await fetchProfile()
    } catch (e: unknown) {
      const error = e as AxiosError
      if (error.response?.status === 400) {
        alert('Neplatné prihlasovacie údaje')
      }
    }
  }

  const logout = async () => {
    // Funkcia, ktorá zavolá logout API point, ktorý zmaže token na BE a odstráni sessionid cookie.
    try {
      await axios.post('/api/user/logout/')
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      alert(error)
    }
    setIsAuthed(false)
    resetProfile()
    // sessionid cookie odstrani server sam
  }

  return {isAuthed, login, logout}
}

export const AuthContainer = createContainer(useAuth)

import axios, {AxiosError} from 'axios'
import {useEffect, useState} from 'react'
import {Cookies} from 'react-cookie'
import {createContainer} from 'unstated-next'

import {Profile} from '@/types/api/generated/personal'
import {Login, Token} from '@/types/api/generated/user'

const emptyProfile: Profile = {
  first_name: '',
  last_name: '',
  nickname: '',
  school: 0,
  phone: '',
  parent_phone: '',
  gdpr: false,
  grade: 0,
}

const cookies = new Cookies()

// webstrom token global state
const useAuth = () => {
  const [isAuthed, setIsAuthed] = useState(false)
  const [profile, setProfile] = useState<Profile>()

  const fetchUserProfile = async (onSuccess?: () => void) => {
    try {
      setProfile(emptyProfile) // treba?
      const {data} = await axios.get<Profile>(`/api/personal/profiles/myprofile/`)
      setProfile(data)
      // ked to necrashlo s errorom, mame spravny sessionid, mozeme zavolat tento optional callback
      // - pouzite pre prihlasenie usera do UI, ak to bol len test request
      onSuccess?.()
    } catch (e: unknown) {
      const error = e as AxiosError
    }
  }

  const testAuthAndLogin = () => {
    fetchUserProfile(() => setIsAuthed(true))
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
          setProfile(emptyProfile)
        }

        return Promise.reject(error)
      },
    )
    // useEffect unmount callback
    return () => {
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [isAuthed])

  const login = async (formData: Login, closeOverlay: () => void) => {
    try {
      // the server should set sessionid cookie here automatically
      await axios.post<Token>('/api/user/login/', formData)

      setIsAuthed(true)
      closeOverlay()

      await fetchUserProfile()
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
    setProfile(emptyProfile)
    // sessionid cookie odstrani server sam
  }

  return {isAuthed, login, logout, profile}
}

export const AuthContainer = createContainer(useAuth)

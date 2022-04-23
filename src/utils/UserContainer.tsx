import axios, {AxiosError} from 'axios'
import {useEffect, useState} from 'react'
import {createContainer} from 'unstated-next'

import {WebstromTokenContainer} from './WebstromTokenContainer'

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

const useUser = () => {
  const [user, setUser] = useState(emptyUser)

  const {webstromToken} = WebstromTokenContainer.useContainer()

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

  return {user}
}
export const UserContainer = createContainer(useUser)

import axios, {AxiosError} from 'axios'
import {useState} from 'react'
import {createContainer} from 'unstated-next'

import {Profile} from '@/types/api/generated/personal'

const useProfile = () => {
  const [profile, setProfile] = useState<Profile>()

  const fetchProfile = async (onSuccess?: () => void) => {
    try {
      const {data} = await axios.get<Profile>(`/api/personal/profiles/myprofile/`)
      setProfile(data)
      // ked to necrashlo s errorom, mame spravny sessionid, mozeme zavolat tento optional callback
      // - pouzite pre prihlasenie usera do UI, ak to bol len test request
      onSuccess?.()
    } catch (e: unknown) {
      setProfile(undefined)
      const error = e as AxiosError
    }
  }

  const resetProfile = () => setProfile(undefined)

  return {profile, fetchProfile, resetProfile}
}

export const ProfileContainer = createContainer(useProfile)

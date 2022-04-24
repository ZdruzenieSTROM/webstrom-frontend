import axios, {AxiosError} from 'axios'
import {useState} from 'react'
import {createContainer} from 'unstated-next'

import {Profile} from '@/types/api/generated/personal'

const useProfile = () => {
  const [profile, setProfile] = useState<Profile>()

  const fetchProfile = async () => {
    try {
      const {data} = await axios.get<Profile>(`/api/personal/profiles/myprofile/`)
      setProfile(data)
      return true
    } catch (e: unknown) {
      setProfile(undefined)
      console.log((e as AxiosError).response?.data)
      return false
    }
  }

  const resetProfile = () => setProfile(undefined)

  return {profile, fetchProfile, resetProfile}
}

export const ProfileContainer = createContainer(useProfile)

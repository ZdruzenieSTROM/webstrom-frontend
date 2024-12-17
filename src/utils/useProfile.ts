import {useQuery} from '@tanstack/react-query'

import {apiAxios} from '@/api/apiAxios'
import {Profile} from '@/types/api/personal'

import {AuthContainer} from './AuthContainer'

export const useProfile = () => {
  const {isAuthed} = AuthContainer.useContainer()

  const {data, isLoading} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => apiAxios.get<Profile>(`/api/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const profile = data?.data

  return {profile, isLoading}
}

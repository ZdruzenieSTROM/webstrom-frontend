import {useQuery} from '@tanstack/react-query'

import {apiOptions} from '@/api/api'

import {AuthContainer} from './AuthContainer'

export const useProfile = () => {
  const {isAuthed} = AuthContainer.useContainer()

  const {data, isLoading} = useQuery({
    ...apiOptions.personal.profiles.myprofile(),
    enabled: isAuthed,
  })

  return {profile: data, isLoading}
}

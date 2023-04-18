import {useQuery} from '@tanstack/react-query'
import axios from 'axios'

import {Profile} from '@/types/api/personal'

export const useIsAdmin = () => {
  const {data} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => axios.get<Profile>(`/api/personal/profiles/myprofile`),
  })

  const isAdmin = !data ? false : !data.data.is_student

  return {isAdmin}
}

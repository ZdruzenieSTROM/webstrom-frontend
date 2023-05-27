import {useQuery} from '@tanstack/react-query'
import axios from 'axios'

import {MyPermissions} from '@/types/api/personal'

import {useSeminarInfo} from './useSeminarInfo'

export const useHasPermissions = () => {
  const {data, isLoading: permissionsIsLoading} = useQuery({
    queryKey: ['personal', 'profiles', 'mypermissions'],
    queryFn: () => axios.get<MyPermissions>('/api/personal/profiles/mypermissions'),
  })

  const permissions = data?.data.competition_permissions

  const {seminarId} = useSeminarInfo()

  const hasPermissions = !permissions ? false : permissions.includes(seminarId)

  return {hasPermissions, permissionsIsLoading}
}

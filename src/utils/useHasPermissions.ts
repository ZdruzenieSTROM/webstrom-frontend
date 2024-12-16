import {useQuery} from '@tanstack/react-query'

import {apiAxios} from '@/api/apiAxios'
import {MyPermissions} from '@/types/api/personal'

import {AuthContainer} from './AuthContainer'
import {useSeminarInfo} from './useSeminarInfo'

export const useHasPermissions = () => {
  const {isAuthed} = AuthContainer.useContainer()

  const {data, isLoading: permissionsIsLoading} = useQuery({
    queryKey: ['personal', 'profiles', 'mypermissions'],
    queryFn: () => apiAxios.get<MyPermissions>('/personal/profiles/mypermissions'),
    enabled: isAuthed,
  })

  const permissions = data?.data.competition_permissions

  const {seminarId} = useSeminarInfo()

  const hasPermissions = !permissions ? false : permissions.includes(seminarId)

  return {hasPermissions, permissionsIsLoading}
}

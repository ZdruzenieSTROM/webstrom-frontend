import {useQuery} from '@tanstack/react-query'

import {apiAxios} from '@/api/apiAxios'
import {MyPermissions} from '@/types/api/personal'

import {AuthContainer} from './AuthContainer'
import {useSeminarInfo} from './useSeminarInfo'

export const useHasPermissions = () => {
  const {isAuthed, initialLoading} = AuthContainer.useContainer()

  const {data, isLoading: permissionsIsLoading} = useQuery({
    queryKey: ['personal', 'profiles', 'mypermissions'],
    queryFn: () => apiAxios.get<MyPermissions>('/personal/profiles/mypermissions'),
    enabled: isAuthed,
  })

  const permissions = data?.data.competition_permissions
  const isSuperuser = data?.data.is_superuser ?? false
  // useful for Admin, as competition_permissions check below won't pass with "admin" seminarId
  const isStaff = data?.data.is_staff ?? false

  // warning: when called on /admin, seminarId is "admin" (not a valid seminarId)
  const {seminarId} = useSeminarInfo()

  const hasPermissions = !permissions ? false : permissions.includes(seminarId)

  return {hasPermissions, isSuperuser, isStaff, permissionsIsLoading: initialLoading || permissionsIsLoading}
}

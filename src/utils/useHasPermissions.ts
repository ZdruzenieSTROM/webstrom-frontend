import {useQuery} from '@tanstack/react-query'

import {apiOptions} from '@/api/api'

import {AuthContainer} from './AuthContainer'
import {useSeminarInfo} from './useSeminarInfo'

export const useHasPermissions = () => {
  const {isAuthed, initialLoading} = AuthContainer.useContainer()

  const {data, isLoading: permissionsIsLoading} = useQuery({
    ...apiOptions.personal.profiles.mypermissions(),
    enabled: isAuthed,
  })

  const permissions = data?.competition_permissions
  const isSuperuser = data?.is_superuser ?? false
  // useful for Admin, as competition_permissions check below won't pass with "admin" seminarId
  const isStaff = data?.is_staff ?? false

  // warning: when called on /admin, seminarId is "admin" (not a valid seminarId)
  const {seminarId} = useSeminarInfo()

  const hasPermissions = !permissions ? false : permissions.includes(seminarId)

  return {hasPermissions, isSuperuser, isStaff, permissionsIsLoading: initialLoading || permissionsIsLoading}
}

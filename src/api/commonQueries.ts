import {QueryClient} from '@tanstack/react-query'

import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

import {apiOptions} from './api'

export const commonQueries = (queryClient: QueryClient, resolvedUrl: string) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  return [
    queryClient.prefetchQuery(apiOptions.cms.menuItem.onSite(seminarId, 'menu')),
    queryClient.prefetchQuery(apiOptions.cms.menuItem.onSite(seminarId, 'footer')),
    queryClient.prefetchQuery(apiOptions.cms.logo()),
  ]
}

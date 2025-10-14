import {QueryClient} from '@tanstack/react-query'
import {GetServerSidePropsContext} from 'next'

import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

import {createSSRApiOptions} from './api'

export const commonQueries = (queryClient: QueryClient, resolvedUrl: string, req: GetServerSidePropsContext['req']) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  // Use SSR API options with forwarded request headers
  const ssrApiOptions = createSSRApiOptions(req)

  return [
    queryClient.prefetchQuery(ssrApiOptions.cms.menuItem.onSite(seminarId, 'menu')),
    queryClient.prefetchQuery(ssrApiOptions.cms.menuItem.onSite(seminarId, 'footer')),
    queryClient.prefetchQuery(ssrApiOptions.cms.logo()),
  ]
}

import axios from 'axios'

import {addTrailingSlash} from '@/utils/trailingSlash'

type RequestInterceptor = Parameters<typeof axios.interceptors.request.use>[0]

export const apiInterceptor: RequestInterceptor = (config) => {
  if (config.url) {
    const [pathname, query] = config.url.split('?')

    const newPathname = addTrailingSlash(pathname)

    config.url = `${newPathname}${query ? `?${query}` : ''}`
  }

  return config
}

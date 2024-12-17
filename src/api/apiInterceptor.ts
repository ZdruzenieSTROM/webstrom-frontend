import axios from 'axios'

import {addApiTrailingSlash} from '@/utils/addApiTrailingSlash'

type RequestInterceptor = Parameters<typeof axios.interceptors.request.use>[0]

export const apiInterceptor: RequestInterceptor = (config) => {
  if (config.url) {
    const [pathname, query] = config.url.split('?')

    const newPathname = addApiTrailingSlash(pathname)

    config.url = `${newPathname}${query ? `?${query}` : ''}`
  }

  return config
}

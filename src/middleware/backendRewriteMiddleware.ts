import {NextRequest, NextResponse} from 'next/server'

import {addApiTrailingSlash} from '@/utils/addApiTrailingSlash'
import {getBackendServerUrl} from '@/utils/urlBase'

export const backendRewriteMiddleware = ({req, trailingSlash}: {req: NextRequest; trailingSlash: boolean}) => {
  const {method, nextUrl} = req
  const {pathname, search, href} = nextUrl

  let newPathname = pathname

  if (trailingSlash) newPathname = addApiTrailingSlash(newPathname)

  const newUrl = new URL(`${newPathname}${search}`, getBackendServerUrl())

  // eslint-disable-next-line no-console
  if (process.env.DEBUG === 'true') console.log('[MIDDLEWARE]', method, href, '->', newUrl.href)

  return NextResponse.rewrite(newUrl)
}

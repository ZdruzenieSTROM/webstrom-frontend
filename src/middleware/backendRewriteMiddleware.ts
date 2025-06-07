import {NextRequest, NextResponse} from 'next/server'

import {addTrailingSlash} from '@/utils/trailingSlash'
import {getBackendServerUrl} from '@/utils/urlBase'

export const backendRewriteMiddleware = ({req, trailingSlash}: {req: NextRequest; trailingSlash: boolean}) => {
  const {method, nextUrl} = req
  const {pathname, search, href} = nextUrl

  let newPathname = pathname

  if (trailingSlash) newPathname = addTrailingSlash(newPathname)

  const newUrl = new URL(`${newPathname}${search}`, getBackendServerUrl())

  // eslint-disable-next-line no-console
  if (process.env.DEBUG_SERVER === 'true') console.log('[MIDDLEWARE]', method, href, '->', newUrl.href)

  // server-side requesty z deployed FE na deployed BE potrebuju tieto hlavicky (podla settings_test.py)
  if (process.env.BE_FORWARDED_HOST) {
    req.headers.set('Host', process.env.BE_FORWARDED_HOST)
    req.headers.set('X-Forwarded-Host', process.env.BE_FORWARDED_HOST)
  }
  if (process.env.BE_FORWARDED_PROTO) req.headers.set('X-Forwarded-Proto', process.env.BE_FORWARDED_PROTO)

  return NextResponse.rewrite(newUrl, {
    request: {
      headers: req.headers,
    },
  })
}

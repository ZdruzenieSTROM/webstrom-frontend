import {NextRequest, NextResponse} from 'next/server'

import {addApiTrailingSlash} from '@/utils/addApiTrailingSlash'
import {getInternalBeServerUrl} from '@/utils/urlBase'

export const apiMiddleware = (req: NextRequest) => {
  const {method, nextUrl} = req
  const {pathname, search, href} = nextUrl

  let newPathname = pathname

  // nahrad prefix "/api" za iny prefix (na lokalny BE "", na deployed BE "/api")
  newPathname = newPathname.replace(/^\/api/, process.env.BE_PREFIX ?? '')

  newPathname = addApiTrailingSlash(newPathname)

  const newUrl = new URL(`${newPathname}${search}`, getInternalBeServerUrl())

  // eslint-disable-next-line no-console
  if (process.env.DEBUG === 'true') console.log('[MIDDLEWARE]', method, href, '->', newUrl.href)

  return NextResponse.rewrite(newUrl)
}

import {NextRequest, NextResponse} from 'next/server'

import {apiMiddleware} from './middleware/apiMiddleware'

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (url.pathname.startsWith('/api')) {
    return apiMiddleware(req)
  }

  // https://nextjs.org/docs/app/building-your-application/routing/middleware#advanced-middleware-flags
  // odstran trailing slash - default next.js spravanie, ale vypli sme ho v next.config.ts pomocou
  // `skipTrailingSlashRedirect: true`, aby sme dovolili (a v axiose a middlewari vyssie aj forcli)
  // trailing slash pre BE Django
  // pre root route `/` to nemozeme spravit (infinite redirect) ¯\_(ツ)_/¯
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    const newPathname = url.pathname.slice(0, -1)
    const newUrl = new URL(`${newPathname}${url.search}`, url)

    return NextResponse.redirect(newUrl, 308)
  }

  return NextResponse.next()
}

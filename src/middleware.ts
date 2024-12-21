import {NextRequest, NextResponse} from 'next/server'

import {backendRewriteMiddleware} from './middleware/backendRewriteMiddleware'
import {removeTrailingSlash} from './utils/trailingSlash'

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  if (url.pathname.startsWith('/api')) {
    return backendRewriteMiddleware({req, trailingSlash: true})
  }
  if (url.pathname.startsWith('/media')) {
    return backendRewriteMiddleware({req, trailingSlash: false})
  }

  // https://nextjs.org/docs/app/building-your-application/routing/middleware#advanced-middleware-flags
  // odstran trailing slash - default next.js spravanie, ale vypli sme ho v next.config.ts pomocou
  // `skipTrailingSlashRedirect: true`, aby sme dovolili (a v axiose a middlewari vyssie aj forcli)
  // trailing slash pre BE Django
  const newPathname = removeTrailingSlash(url.pathname)

  // redirect ak sa da odstranit trailing slash
  if (newPathname !== url.pathname) {
    const newUrl = new URL(`${newPathname}${url.search}`, url)

    return NextResponse.redirect(newUrl, 308)
  }

  return NextResponse.next()
}

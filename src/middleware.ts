import {NextRequest, NextResponse} from 'next/server'

import {backendRewriteMiddleware} from './middleware/backendRewriteMiddleware'
import {removeTrailingSlash} from './utils/trailingSlash'

export function middleware(req: NextRequest) {
  const url = req.nextUrl

  // - na deployed serveri tieto lokalne routy chyti nginx proxy a posle ich na BE,
  //   do tohto middlewaru sa to nedostane.
  // - na localhoste tieto routy chyti next.js a posle ich do tohto middlewaru.
  //   simulujeme nginx podla viacmenej podla tohto:
  //   https://github.com/ZdruzenieSTROM/webstrom-backend/pull/491#discussion_r1893181775
  if (url.pathname.startsWith('/api')) {
    return backendRewriteMiddleware({req, trailingSlash: true})
  }
  // casopisy, riesenia, opravene riesenia
  if (url.pathname.startsWith('/media')) {
    return backendRewriteMiddleware({req, trailingSlash: false})
  }
  // napr. http://localhost:3000/django-admin
  if (url.pathname.startsWith('/django-admin')) {
    return backendRewriteMiddleware({req, trailingSlash: true})
  }
  // napr. `/django-admin` fetchuje CSSka zo `/static`
  if (url.pathname.startsWith('/static')) {
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

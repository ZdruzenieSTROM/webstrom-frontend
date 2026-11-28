import type {ErrorEvent} from '@sentry/nextjs'

import {NAVIGATION_TRAP_ERROR_MESSAGE} from './useNavigationTrap'

const HARD_NAVIGATION_INVARIANT = 'Invariant: attempted to hard navigate to the same URL '

// `_next/data/<buildId>/strom/poradie.json` for `/strom/poradie`; the root page is `index.json`.
const nextDataPathSuffix = (targetUrl: string) => {
  const pathname = targetUrl.split(/[#?]/)[0].replace(/\/$/, '')
  return `${pathname || '/index'}.json`
}

// When a client-side navigation can't fetch its `_next/data` JSON, Next falls back to a full page load of the target
// URL, and throws this invariant instead when the target is the page already shown (to avoid a reload loop).
// A 404 there means the tab runs an older build than the server (its buildId is gone after a deploy); no status
// means the request never completed (offline, aborted). Neither is a bug of ours. A 5xx stays reported: that one
// is our getServerSideProps failing. Only the fetch for the invariant's own target counts: link prefetches of other
// pages land in the breadcrumbs too and say nothing about this navigation.
const isBenignHardNavigationInvariant = (event: ErrorEvent, message: string) => {
  const targetUrl = message.slice(HARD_NAVIGATION_INVARIANT.length).split(' ')[0]
  const dataPathSuffix = nextDataPathSuffix(targetUrl)

  const targetDataFetch = event.breadcrumbs?.findLast((breadcrumb) => {
    if (breadcrumb.category !== 'fetch') return false
    const url = String(breadcrumb.data?.url ?? '')
    return url.includes('/_next/data/') && url.split('?')[0].endsWith(dataPathSuffix)
  })
  if (!targetDataFetch) return false

  // Sentry leaves `status_code` out when the fetch failed without a response.
  const status = targetDataFetch.data?.status_code
  return status === undefined || status === 404
}

export const sentryBeforeSend = (event: ErrorEvent): ErrorEvent | null => {
  const messages = event.exception?.values?.map((exception) => exception.value ?? '') ?? []

  if (messages.includes(NAVIGATION_TRAP_ERROR_MESSAGE)) return null

  const invariant = messages.find((message) => message.startsWith(HARD_NAVIGATION_INVARIANT))
  if (invariant && isBenignHardNavigationInvariant(event, invariant)) return null

  return event
}

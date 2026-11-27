import type {ErrorEvent} from '@sentry/nextjs'

import {NAVIGATION_TRAP_ERROR_MESSAGE} from './useNavigationTrap'

const HARD_NAVIGATION_INVARIANT = 'Invariant: attempted to hard navigate to the same URL'

// When a client-side navigation can't fetch its `_next/data` JSON, Next falls back to a full page load of the target
// URL, and throws this invariant instead when the target is the page already shown (to avoid a reload loop).
// A 404 there means the tab runs an older build than the server (its buildId is gone after a deploy); no status
// means the request never completed (offline, aborted). Neither is a bug of ours. A 5xx stays reported: that one
// is our getServerSideProps failing.
const isBenignHardNavigationInvariant = (event: ErrorEvent) => {
  const lastNextDataFetch = event.breadcrumbs?.findLast(
    (breadcrumb) => breadcrumb.category === 'fetch' && String(breadcrumb.data?.url ?? '').includes('/_next/data/'),
  )
  if (!lastNextDataFetch) return false

  const status = lastNextDataFetch.data?.status_code
  return status === undefined || status === 0 || status === 404
}

export const sentryBeforeSend = (event: ErrorEvent): ErrorEvent | null => {
  const messages = event.exception?.values?.map((exception) => exception.value ?? '') ?? []

  if (messages.includes(NAVIGATION_TRAP_ERROR_MESSAGE)) return null

  if (
    messages.some((message) => message.startsWith(HARD_NAVIGATION_INVARIANT)) &&
    isBenignHardNavigationInvariant(event)
  ) {
    return null
  }

  return event
}

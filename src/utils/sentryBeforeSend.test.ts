import type {Breadcrumb, ErrorEvent} from '@sentry/nextjs'
import {describe, expect, it} from 'vitest'

import {sentryBeforeSend} from './sentryBeforeSend'

const errorEvent = (message: string, breadcrumbs: Breadcrumb[] = []): ErrorEvent => ({
  type: undefined,
  exception: {values: [{type: 'Error', value: message}]},
  breadcrumbs,
})

const nextDataFetch = (status_code?: number, page = 'strom/poradie.json'): Breadcrumb => ({
  category: 'fetch',
  type: 'http',
  data: {method: 'GET', url: `/_next/data/gcMHPzRtZH_nUkyvPROth/${page}`, status_code},
})

const invariant = 'Invariant: attempted to hard navigate to the same URL /strom/poradie https://strom.sk/strom/poradie'

describe(sentryBeforeSend, () => {
  it('should drop the navigation trap abort', () => {
    expect(sentryBeforeSend(errorEvent('Canceling navigation due to unsaved changes in the page'))).toBeNull()
  })

  it('should drop the hard-navigation invariant when the data fetch 404s on a stale build', () => {
    expect(sentryBeforeSend(errorEvent(invariant, [nextDataFetch(404)]))).toBeNull()
  })

  it('should drop the hard-navigation invariant when the data fetch never completed', () => {
    expect(sentryBeforeSend(errorEvent(invariant, [nextDataFetch()]))).toBeNull()
  })

  it('should judge the invariant by the latest data fetch, not an earlier one', () => {
    const event = errorEvent(invariant, [nextDataFetch(404), nextDataFetch(500)])

    expect(sentryBeforeSend(event)).toBe(event)
  })

  it('should judge the invariant by the data fetch of its own target, not a later prefetch of another page', () => {
    const event = errorEvent(invariant, [nextDataFetch(500), nextDataFetch(404, 'strom/zadania.json')])

    expect(sentryBeforeSend(event)).toBe(event)
  })

  it('should match a catch-all target whose data fetch carries a query', () => {
    const event = errorEvent(
      'Invariant: attempted to hard navigate to the same URL /strom/zadania/51/zima/1 https://strom.sk/strom/zadania/51/zima/1',
      [nextDataFetch(undefined, 'strom/zadania/51/zima/1.json?params=51&params=zima&params=1')],
    )

    expect(sentryBeforeSend(event)).toBeNull()
  })

  it('should match the root page to index.json', () => {
    const event = errorEvent('Invariant: attempted to hard navigate to the same URL / https://strom.sk/', [
      nextDataFetch(404, 'index.json'),
    ])

    expect(sentryBeforeSend(event)).toBeNull()
  })

  it('should keep the hard-navigation invariant when getServerSideProps answered 5xx', () => {
    const event = errorEvent(invariant, [nextDataFetch(500)])

    expect(sentryBeforeSend(event)).toBe(event)
  })

  it('should keep the hard-navigation invariant when no data fetch explains it', () => {
    const event = errorEvent(invariant, [
      {category: 'xhr', type: 'http', data: {method: 'GET', url: '/api/cms/logo/', status_code: 0}},
    ])

    expect(sentryBeforeSend(event)).toBe(event)
  })

  it('should keep unrelated errors', () => {
    const event = errorEvent('TypeError: (intermediate value).map is not a function', [nextDataFetch(404)])

    expect(sentryBeforeSend(event)).toBe(event)
  })
})

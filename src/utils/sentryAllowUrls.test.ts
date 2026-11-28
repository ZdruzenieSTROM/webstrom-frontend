import type {ErrorEvent, StackFrame} from '@sentry/nextjs'
import {eventFiltersIntegration} from '@sentry/nextjs'
import {describe, expect, it} from 'vitest'

import {SENTRY_ALLOW_URLS} from './sentryAllowUrls'

// Runs the SDK's own filter, the one `allowUrls` in `Sentry.init` configures.
const isKept = (frames?: StackFrame[]) => {
  const event: ErrorEvent = {
    type: undefined,
    exception: {values: [{type: 'TypeError', value: 'boom', ...(frames && {stacktrace: {frames}})}]},
  }
  const filter = eventFiltersIntegration({allowUrls: SENTRY_ALLOW_URLS})
  // The filter reads only `getOptions()` from the client, to merge its options with `Sentry.init`'s.
  const client = {getOptions: () => ({})} as unknown as Parameters<NonNullable<typeof filter.processEvent>>[2]

  return filter.processEvent?.(event, {}, client) === event
}

const frame = (filename: string, func: string): StackFrame => ({filename, function: func, lineno: 1, colno: 1})

// Frames as captured in production: Sentry's XHR callback wrapper in our chunk, then the injected script that threw.
const sentryXhrWrapper = frame('app:///_next/static/chunks/998e32cd93967daa.js', 'XMLHttpRequest.r')
const injectedScript = [
  frame('app:///executors/200.js', 'XMLHttpRequest.<anonymous>'),
  frame('app:///executors/200.js', 'h'),
]

describe('SENTRY_ALLOW_URLS', () => {
  it('should drop an error thrown by an injected script when Sentry wrapped its XHR callback', () => {
    expect(isKept([sentryXhrWrapper, ...injectedScript])).toBe(false)
  })

  it('should drop an error thrown by a script the browser attributes to the page URL', () => {
    expect(isKept([frame('https://strom.sk/strom/poradie', 'r'), frame('https://strom.sk/strom/poradie', 'n')])).toBe(
      false,
    )
  })

  it('should keep an error thrown in our code even when an injected script called it', () => {
    expect(isKept([...injectedScript, frame('https://strom.sk/_next/static/chunks/51bfb301aabcd6e5.js', 'f')])).toBe(
      true,
    )
  })

  it('should keep an error thrown in the Turbopack runtime', () => {
    expect(isKept([sentryXhrWrapper, frame('app:///_next/static/chunks/turbopack-59efb162cb9c1aa3.js', 'l')])).toBe(
      true,
    )
  })

  it('should keep an error thrown in native code called from our code', () => {
    const ourCaller = frame('https://strom.sk/_next/static/chunks/51bfb301aabcd6e5.js', 'f')

    expect(isKept([ourCaller, frame('<anonymous>', 'JSON.parse')])).toBe(true)
    expect(isKept([ourCaller, frame('[native code]', 'parse')])).toBe(true)
  })

  it('should keep an error without a stack trace', () => {
    expect(isKept()).toBe(true)
  })
})

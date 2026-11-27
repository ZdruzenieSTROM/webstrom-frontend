import type {ErrorEvent, StackFrame} from '@sentry/nextjs'
import {describe, expect, it} from 'vitest'

import {isThrownInThirdPartyCode} from './sentryThirdPartyFilter'

const ourMetadata = {'_sentryBundlerPluginAppKey:webstrom-frontend': true}

const errorEvent = (frames: StackFrame[]): ErrorEvent => ({
  type: undefined,
  exception: {
    values: [{type: 'TypeError', value: "Cannot read properties of undefined (reading 'M_ID')", stacktrace: {frames}}],
  },
})

// Frames as captured in production: Sentry's XHR callback wrapper in our chunk, then the injected script that threw.
const sentryXhrWrapperFrame: StackFrame = {
  filename: 'app:///_next/static/chunks/998e32cd93967daa.js',
  function: 'XMLHttpRequest.r',
  lineno: 2,
  colno: 5586,
  in_app: true,
  module_metadata: ourMetadata,
}
const injectedScriptFrames: StackFrame[] = [
  {filename: 'app:///executors/200.js', function: 'XMLHttpRequest.<anonymous>', lineno: 1, colno: 2598, in_app: true},
  {filename: 'app:///executors/200.js', function: 'h', lineno: 1, colno: 761, in_app: true},
]

describe('isThrownInThirdPartyCode', () => {
  it('should flag an error thrown by an injected script when Sentry wrapped its XHR callback', () => {
    expect(isThrownInThirdPartyCode(errorEvent([sentryXhrWrapperFrame, ...injectedScriptFrames]))).toBe(true)
  })

  it('should keep an error thrown in our code even when an injected script called it', () => {
    const ourThrowingFrame: StackFrame = {
      filename: 'app:///_next/static/chunks/51bfb301aabcd6e5.js',
      function: 'onSubmit',
      lineno: 1,
      colno: 4242,
      in_app: true,
      module_metadata: ourMetadata,
    }

    expect(isThrownInThirdPartyCode(errorEvent([...injectedScriptFrames, ourThrowingFrame]))).toBe(false)
  })

  it('should keep an error thrown in the unstamped Turbopack runtime', () => {
    const runtimeFrame: StackFrame = {
      filename: 'app:///_next/static/chunks/turbopack-59efb162cb9c1aa3.js',
      function: 'loadChunk',
      lineno: 1,
      colno: 900,
      in_app: true,
    }

    expect(isThrownInThirdPartyCode(errorEvent([sentryXhrWrapperFrame, runtimeFrame]))).toBe(false)
  })

  it('should keep an error without a stack trace', () => {
    expect(isThrownInThirdPartyCode({type: undefined, message: 'manual capture'})).toBe(false)
  })
})

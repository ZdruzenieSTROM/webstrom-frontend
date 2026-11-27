import type {ErrorEvent, StackFrame} from '@sentry/nextjs'

import {SENTRY_APPLICATION_KEY} from '../../sentry.shared'

// The bundler plugin stamps our modules with this key; `thirdPartyErrorFilterIntegration` copies it onto each frame's
// `module_metadata` before `beforeSend` runs and strips it before the event is sent.
const APPLICATION_KEY_METADATA = `_sentryBundlerPluginAppKey:${SENTRY_APPLICATION_KEY}`

// The Turbopack runtime chunks are not stamped, so a frame we served from `/_next/` counts as ours even without the key.
const isFirstPartyFrame = (frame: StackFrame) =>
  frame.module_metadata?.[APPLICATION_KEY_METADATA] === true || frame.filename?.includes('/_next/') === true

// Sentry wraps every callback passed to XHR, timers and event listeners, so an error thrown by an extension's callback
// carries our wrapper as its outermost frame and `drop-error-if-exclusively-contains-third-party-frames` keeps it.
// Judging by the frame that threw catches those too.
export const isThrownInThirdPartyCode = (event: ErrorEvent) => {
  const frames = event.exception?.values?.at(-1)?.stacktrace?.frames
  // Frames are ordered outermost first; frames without a location are native code, which never counts either way.
  const thrownFrame = frames?.findLast((frame) => frame.filename && (frame.lineno != null || frame.colno != null))

  return thrownFrame !== undefined && !isFirstPartyFrame(thrownFrame)
}

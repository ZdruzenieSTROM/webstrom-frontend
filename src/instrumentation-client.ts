// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

import {SENTRY_APPLICATION_KEY} from '../sentry.shared'

Sentry.init({
  dsn: 'https://428ff2792107c70d35d5eca360f4617a@o4510493471932416.ingest.de.sentry.io/4511236823449680',

  // Don't send events to Sentry in development
  enabled: process.env.NODE_ENV !== 'development',

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    // Drops errors raised entirely in code we didn't ship: browser extensions and scripts injected by the browser
    // itself (e.g. Chrome on iOS), which Sentry attributes to the page URL and splits into one issue per page.
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: [SENTRY_APPLICATION_KEY],
      behaviour: 'drop-error-if-exclusively-contains-third-party-frames',
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

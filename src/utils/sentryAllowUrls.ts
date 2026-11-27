// Sentry keeps an error only if the frame that threw it matches one of these. Every script we ship, the Turbopack
// runtime included, is served from `/_next/static/`; browser extensions and scripts injected by the browser itself
// (e.g. Chrome on iOS) report other URLs, often the page URL. Matching the thrower rather than any frame matters:
// Sentry wraps XHR, timer and event-listener callbacks, so an extension's error carries a frame from our bundle too.
// If the client assets ever move off `/_next/static/` (assetPrefix, a CDN), update this or every error is dropped.
export const SENTRY_ALLOW_URLS = [/\/_next\/static\//]

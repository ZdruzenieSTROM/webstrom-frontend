// Sentry keeps an error only if its innermost frame with a URL matches one of these (frames of native code, named
// `<anonymous>` or `[native code]`, are skipped); an error with no URL at all, like one without a stack, is kept.
// Every script we ship, the Turbopack runtime included, is served from `/_next/static/`; browser extensions and scripts
// injected by the browser itself (e.g. Chrome on iOS) report other URLs, often the page URL. Matching the thrower
// rather than any frame matters: Sentry wraps XHR, timer and event-listener callbacks, so an extension's error carries
// a frame from our bundle too.
// If the client assets ever move off `/_next/static/` (assetPrefix, a CDN), update this or every error is dropped.
export const SENTRY_ALLOW_URLS = [/\/_next\/static\//]

// https://nextjs.org/docs/pages/api-reference/components/link#prefetch
// by default, next.js prefetchuje stranky vsetkych linkov vo viewporte. pre media PDFka je to zbytocne heavy.
// inak aj pri `false` sa stale prefetchne pri hoveri, co je acceptable.
export const getDefaultLinkPrefetch = (href?: string) => {
  if (!href) return false

  const isMedia = href.startsWith('/media')
  return !isMedia
}

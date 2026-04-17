// https://nextjs.org/docs/pages/api-reference/components/link#prefetch
// by default, next.js prefetchuje stranky vsetkych linkov vo viewporte. pre media PDFka je to zbytocne heavy.
// inak aj pri `false` sa stale prefetchne pri hoveri, co je acceptable.
export const isExternalLink = (href?: string) => {
  if (!href) return false
  if (href.startsWith('/media') || href.startsWith('/api/')) return true
  return /^([a-z][\d+.a-z-]*:|\/\/)/i.test(href)
}

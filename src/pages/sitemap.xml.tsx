import {GetServerSideProps, NextPage} from 'next'

import {createSSRApiOptions} from '@/api/api'
import {MenuItemShort} from '@/types/api/cms'
import {removeTrailingSlash} from '@/utils/trailingSlash'

const seminars = [
  {id: 0, slug: 'strom'},
  {id: 1, slug: 'matik'},
  {id: 2, slug: 'malynar'},
] as const

const page: NextPage = () => null

const xmlEscape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const normalizeInternalPath = (url: string, seminarSlug: string, siteHost: string) => {
  const trimmed = url.trim()

  if (!trimmed) return undefined

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const parsed = new URL(trimmed)
    if (parsed.host !== siteHost) return undefined

    const pathname = removeTrailingSlash(parsed.pathname || '/')
    return pathname || '/'
  }

  if (trimmed.startsWith('www.')) return undefined

  const localPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const prefixed = `/${seminarSlug}${localPath}`
  return removeTrailingSlash(prefixed)
}

const toSitemapXml = (urls: string[]) => {
  const urlRows = urls.map((url) => `  <url>\n    <loc>${xmlEscape(url)}</loc>\n  </url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlRows}\n</urlset>\n`
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://strom.sk').replace(/\/$/, '')
  const siteHost = new URL(siteUrl).host

  const api = createSSRApiOptions(req)
  const internalPaths = new Set<string>(['/'])

  for (const {slug} of seminars) {
    internalPaths.add(`/${slug}`)
    internalPaths.add(`/${slug}/zadania`)
    internalPaths.add(`/${slug}/archiv`)
    internalPaths.add(`/${slug}/poradie`)
    internalPaths.add(`/${slug}/akcie`)
    internalPaths.add(`/${slug}/registracia`)
  }

  const menuQueries = seminars.flatMap(({id}) => [
    api.cms.menuItem.onSite(id, 'menu').queryFn(),
    api.cms.menuItem.onSite(id, 'footer').queryFn(),
  ])
  const menuResults = await Promise.allSettled(menuQueries)

  for (const [seminarIndex, {slug}] of seminars.entries()) {
    const menuResult = menuResults[seminarIndex * 2]
    const footerResult = menuResults[seminarIndex * 2 + 1]
    const items: MenuItemShort[] = []

    if (menuResult.status === 'fulfilled') items.push(...menuResult.value)
    if (footerResult.status === 'fulfilled') items.push(...footerResult.value)

    for (const item of items) {
      const path = normalizeInternalPath(item.url, slug, siteHost)
      if (path) internalPaths.add(path)
    }
  }

  const urls = [...internalPaths].map((path) => `${siteUrl}${path}`).toSorted((a, b) => a.localeCompare(b))

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(toSitemapXml(urls))
  res.end()

  return {props: {}}
}

export default page

import {GetServerSideProps, NextPage} from 'next'

import {createSSRApiOptions} from '@/api/api'
import {MenuItemShort} from '@/types/api/cms'
import {Semester} from '@/types/api/competition'
import {removeTrailingSlash} from '@/utils/trailingSlash'
import {seminarIds, seminarIdToName} from '@/utils/useSeminarInfo'

const seminars = seminarIds.map((id) => ({id, slug: seminarIdToName[id]}))

const page: NextPage = () => null

type SitemapEntry = {
  loc: string
  lastmod?: string
}

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

const toSitemapXml = (entries: SitemapEntry[]) => {
  const urlRows = entries
    .map(({loc, lastmod}) => {
      const lastmodTag = lastmod ? `\n    <lastmod>${xmlEscape(lastmod)}</lastmod>` : ''
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmodTag}\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlRows}\n</urlset>\n`
}

const seasonSlug = (seasonCode: number) => (seasonCode === 0 ? 'zima' : 'leto')

const addPath = (paths: Map<string, string | undefined>, path: string, lastmod?: string) => {
  if (!paths.has(path) || (!paths.get(path) && lastmod)) {
    paths.set(path, lastmod)
  }
}

const addSemesterAndSeriesPaths = (
  internalPaths: Map<string, string | undefined>,
  slug: string,
  semesters: Semester[],
) => {
  for (const semester of semesters) {
    const semesterPath = `/${semester.year}/${seasonSlug(semester.season_code)}`

    addPath(internalPaths, `/${slug}/archiv${semesterPath}`, semester.end)
    addPath(internalPaths, `/${slug}/zadania${semesterPath}`, semester.end)
    addPath(internalPaths, `/${slug}/poradie${semesterPath}`, semester.end)

    for (const series of semester.series_set) {
      addPath(internalPaths, `/${slug}/zadania${semesterPath}/${series.order}`, series.deadline)
      addPath(internalPaths, `/${slug}/poradie${semesterPath}/${series.order}`, series.deadline)
    }
  }
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://strom.sk').replace(/\/$/, '')
  const siteHost = new URL(siteUrl).host

  const api = createSSRApiOptions(req)
  const internalPaths = new Map<string, string | undefined>([['/', undefined]])

  for (const {slug} of seminars) {
    addPath(internalPaths, `/${slug}`)
    addPath(internalPaths, `/${slug}/zadania`)
    addPath(internalPaths, `/${slug}/archiv`)
    addPath(internalPaths, `/${slug}/poradie`)
    addPath(internalPaths, `/${slug}/akcie`)
  }

  await Promise.all(
    seminars.map(async ({id, slug}) => {
      const [menuResult, footerResult, semesterListResult] = await Promise.allSettled([
        api.cms.menuItem.onSite(id, 'menu').queryFn(),
        api.cms.menuItem.onSite(id, 'footer').queryFn(),
        api.competition.semesterList(id).queryFn(),
      ])
      const items: MenuItemShort[] = []

      if (menuResult.status === 'fulfilled') items.push(...menuResult.value)
      if (footerResult.status === 'fulfilled') items.push(...footerResult.value)

      for (const item of items) {
        const path = normalizeInternalPath(item.url, slug, siteHost)
        if (path) addPath(internalPaths, path)
      }

      if (semesterListResult.status === 'fulfilled') {
        addSemesterAndSeriesPaths(internalPaths, slug, semesterListResult.value)
      }
    }),
  )

  const urls = [...internalPaths.entries()]
    .map(([path, lastmod]) => ({loc: `${siteUrl}${path}`, lastmod}))
    .toSorted((a, b) => a.loc.localeCompare(b.loc))

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(toSitemapXml(urls))
  res.end()

  return {props: {}}
}

export default page

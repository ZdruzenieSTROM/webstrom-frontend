// @vitest-environment node
import {NextRequest} from 'next/server'
import {afterEach, describe, expect, it, vi} from 'vitest'

import {proxy} from './proxy'

const robotsHeader = (url: string) => proxy(new NextRequest(url)).headers.get('X-Robots-Tag')

describe(proxy, () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('marks pages and redirects as noindex when ROBOTS_NOINDEX is on', () => {
    vi.stubEnv('ROBOTS_NOINDEX', 'true')

    expect(robotsHeader('https://test.strom.sk/matik')).toBe('noindex, nofollow')
    expect(robotsHeader('https://test.strom.sk/matik/')).toBe('noindex, nofollow')
  })

  it('leaves responses indexable when ROBOTS_NOINDEX is not set', () => {
    expect(robotsHeader('https://strom.sk/matik')).toBeNull()
    expect(robotsHeader('https://strom.sk/matik/')).toBeNull()
  })
})

import {describe, expect, it} from 'vitest'

import {findMarkdownLinks} from './postMarkdown'

describe('findMarkdownLinks', () => {
  it('finds no links in plain text', () => {
    expect(findMarkdownLinks('')).toStrictEqual([])
    expect(findMarkdownLinks('Ahoj, sústredenie bude v pondelok. obr.png')).toStrictEqual([])
  })

  it('ignores dots inside TeX', () => {
    expect(findMarkdownLinks(String.raw`Nech $a.b = c.d$ a \(x.com\)`)).toStrictEqual([])
  })

  it('finds markdown links', () => {
    expect(findMarkdownLinks('Pozri [tu](https://strom.sk/a)')).toStrictEqual(['https://strom.sk/a'])
  })

  it('finds GFM autolinks', () => {
    expect(findMarkdownLinks('Viac na https://strom.sk')).toStrictEqual(['https://strom.sk'])
    expect(findMarkdownLinks('Viac na www.strom.sk')).toStrictEqual(['http://www.strom.sk'])
    expect(findMarkdownLinks('Viac na <https://strom.sk>')).toStrictEqual(['https://strom.sk'])
  })
})

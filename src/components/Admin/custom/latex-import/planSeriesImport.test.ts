import {readFileSync} from 'node:fs'
import path from 'node:path'

import {describe, expect, it} from 'vitest'

import {planSeriesImport} from './planSeriesImport'

// STROM 51, winter semester – the series 1 file as written in Overleaf
// (the path is built from this test file's directory, not from input)
// eslint-disable-next-line security/detect-non-literal-fs-filename
const zadania1 = readFileSync(path.join(import.meta.dirname, '__fixtures__/STROM-51-Z-zadania1.tex'), 'utf8')

describe(planSeriesImport, () => {
  it('should plan every problem of the series and attach the existing problem of the same order', () => {
    const existing = {id: 502, order: 2, image: 'https://test.strom.sk/media/problem_images/2.png'}
    const {rows, otherSeries, duplicates, unclosed} = planSeriesImport(zadania1, 1, [{id: 501, order: 1}, existing])

    expect(rows.map(({order, existing}) => [order, existing?.id])).toStrictEqual([
      [1, 501],
      [2, 502],
      [3, undefined],
      [4, undefined],
      [5, undefined],
      [6, undefined],
    ])
    expect(rows[1]).toStrictEqual({
      order: 2,
      markdown:
        'Dokážte, že súčin troch po sebe idúcich kladných celých čísel nemôže byť treťou mocninou kladného celého čísla.',
      warnings: [],
      existing,
    })
    expect({otherSeries, duplicates, unclosed}).toStrictEqual({otherSeries: [], duplicates: [], unclosed: []})
  })

  it('should carry the converter warnings of each problem', () => {
    const {rows} = planSeriesImport(zadania1, 1, [])

    expect(rows[2].warnings).toStrictEqual(['Obrázok obr/4-3.PNG sa do textu neprenáša – nahraj ho do poľa Obrázok.'])
  })

  it('should plan nothing and report the file series when it belongs to another series', () => {
    expect(planSeriesImport(zadania1, 2, [])).toStrictEqual({rows: [], otherSeries: [1], duplicates: [], unclosed: []})
  })

  it('should keep only the problems of the series when the file has two series', () => {
    const latex = String.raw`\newcommand{\zadIsI}{Prvá séria.}
\newcommand{\zadIsII}{Druhá séria, \textit{prvá} úloha.}
\newcommand{\zadIIsII}{Druhá séria, druhá úloha.}`

    expect(planSeriesImport(latex, 2, []).rows).toStrictEqual([
      {order: 1, markdown: 'Druhá séria, *prvá* úloha.', warnings: [], existing: undefined},
      {order: 2, markdown: 'Druhá séria, druhá úloha.', warnings: [], existing: undefined},
    ])
  })

  it('should plan one row per order and report the repeats when the file is pasted twice', () => {
    const {rows, duplicates} = planSeriesImport(`${zadania1}\n${zadania1}`, 1, [])

    expect(rows.map(({order}) => order)).toStrictEqual([1, 2, 3, 4, 5, 6])
    expect(duplicates).toStrictEqual([1, 2, 3, 4, 5, 6])
  })

  it('should report the unclosed problems of the series only', () => {
    const latex = String.raw`\newcommand{\zadIsI}{Hotová.}
\newcommand{\zadIsII}{Iná séria, chýba zátvorka.
\newcommand{\zadIIsI}{Chýba zátvorka.`

    expect(planSeriesImport(latex, 1, []).unclosed).toStrictEqual([2])
  })
})

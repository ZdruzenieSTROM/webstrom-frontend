import {readFileSync} from 'node:fs'
import path from 'node:path'

import {describe, expect, it} from 'vitest'

import {planSeriesImport} from './planSeriesImport'

// STROM 51, winter semester – the series 1 file as written in Overleaf
const zadania1 = readFileSync(path.join(import.meta.dirname, '__fixtures__/STROM-51-Z-zadania1.tex'), 'utf8')

describe(planSeriesImport, () => {
  it('should plan every problem of the series and mark the orders that already exist', () => {
    const {rows, otherSeries} = planSeriesImport(zadania1, 1, [
      {id: 501, order: 1},
      {id: 502, order: 2},
    ])

    expect(rows.map(({order, existingId}) => [order, existingId])).toStrictEqual([
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
      existingId: 502,
    })
    expect(otherSeries).toStrictEqual([])
  })

  it('should carry the converter warnings of each problem', () => {
    const {rows} = planSeriesImport(zadania1, 1, [])

    expect(rows[2].warnings).toStrictEqual(['Obrázok obr/4-3.PNG sa do textu neprenáša – nahraj ho do poľa Obrázok.'])
  })

  it('should plan nothing and report the file series when it belongs to another series', () => {
    expect(planSeriesImport(zadania1, 2, [])).toStrictEqual({rows: [], otherSeries: [1]})
  })

  it('should keep only the problems of the series when the file has two series', () => {
    const latex = String.raw`\newcommand{\zadIsI}{Prvá séria.}
\newcommand{\zadIsII}{Druhá séria, \textit{prvá} úloha.}
\newcommand{\zadIIsII}{Druhá séria, druhá úloha.}`

    expect(planSeriesImport(latex, 2, [])).toStrictEqual({
      rows: [
        {order: 1, markdown: 'Druhá séria, *prvá* úloha.', warnings: [], existingId: undefined},
        {order: 2, markdown: 'Druhá séria, druhá úloha.', warnings: [], existingId: undefined},
      ],
      otherSeries: [1],
    })
  })
})

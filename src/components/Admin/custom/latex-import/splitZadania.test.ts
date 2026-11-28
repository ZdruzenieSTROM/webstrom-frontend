import {readFileSync} from 'node:fs'
import path from 'node:path'

import {describe, expect, it} from 'vitest'

import {splitZadania} from './splitZadania'

// the path is built from this test file's directory, not from input
// eslint-disable-next-line security/detect-non-literal-fs-filename
const zadania1 = readFileSync(path.join(import.meta.dirname, '__fixtures__/STROM-51-Z-zadania1.tex'), 'utf8')

describe(splitZadania, () => {
  it('should split a series file into its problems with series and order from the macro name', () => {
    const {problems, unclosed} = splitZadania(zadania1)

    expect(problems.map(({series, order}) => [series, order])).toStrictEqual([
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
    ])
    expect(problems[1].tex).toBe(
      'Dokážte, že súčin troch po sebe idúcich kladných celých čísel nemôže byť treťou mocninou kladného celého čísla.',
    )
    expect(unclosed).toStrictEqual([])
  })

  it('should keep nested braces inside a problem body', () => {
    expect(splitZadania(zadania1).problems[5].tex)
      .toBe(String.raw`Nájdite všetky funkcie \(f: \mathbb{Z}\rightarrow\mathbb{Z}\) také, že pre všetky \(a,b\in\mathbb{Z}\) platí:
\[f(a+b)+f(ab-1)=f(a)f(b)+2.\]`)
  })

  it('should read series II and ignore a commented-out definition', () => {
    const src = String.raw`% \newcommand{\zadIsII}{stará verzia}
\newcommand{\zadIVsII}{
Text % {nevyvážená zátvorka v komentári
pokračuje.
}`

    expect(splitZadania(src).problems).toStrictEqual([
      {series: 2, order: 4, tex: 'Text % {nevyvážená zátvorka v komentári\npokračuje.'},
    ])
  })

  it('should accept the other ways to define the macro', () => {
    const src = String.raw`\newcommand*{\zadIsI}{a}
\renewcommand{\zadIIsI}{b}
\newcommand{\zadIIIsI}[0]{c}
\def\zadIVsI{d}`

    expect(splitZadania(src).problems.map(({order, tex}) => [order, tex])).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
      [4, 'd'],
    ])
  })

  it('should report a problem whose body never closes', () => {
    const src = String.raw`\newcommand{\zadIsI}{Hotová.}
\newcommand{\zadIIsI}{Chýba zátvorka.`

    expect(splitZadania(src)).toStrictEqual({
      problems: [{series: 1, order: 1, tex: 'Hotová.'}],
      unclosed: [{series: 1, order: 2}],
    })
  })

  it('should return no problems for a text without problem macros', () => {
    expect(splitZadania(String.raw`Nájdi \(x\).`)).toStrictEqual({problems: [], unclosed: []})
  })
})

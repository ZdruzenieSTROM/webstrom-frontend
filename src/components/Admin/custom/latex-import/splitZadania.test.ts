import {readFileSync} from 'node:fs'
import path from 'node:path'

import {describe, expect, it} from 'vitest'

import {splitZadania} from './splitZadania'

const zadania1 = readFileSync(path.join(import.meta.dirname, '__fixtures__/STROM-51-Z-zadania1.tex'), 'utf8')

describe(splitZadania, () => {
  it('should split a series file into its problems with series and order from the macro name', () => {
    const problems = splitZadania(zadania1)

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
  })

  it('should keep nested braces inside a problem body', () => {
    const problems = splitZadania(zadania1)

    expect(problems[5].tex)
      .toBe(String.raw`Nájdite všetky funkcie \(f: \mathbb{Z}\rightarrow\mathbb{Z}\) také, že pre všetky \(a,b\in\mathbb{Z}\) platí:
\[f(a+b)+f(ab-1)=f(a)f(b)+2.\]`)
  })

  it('should read series II and ignore a commented-out definition', () => {
    const src = String.raw`% \newcommand{\zadIsII}{stará verzia}
\newcommand{\zadIVsII}{
Text % {nevyvážená zátvorka v komentári
pokračuje.
}`

    expect(splitZadania(src)).toStrictEqual([
      {series: 2, order: 4, tex: 'Text % {nevyvážená zátvorka v komentári\npokračuje.'},
    ])
  })

  it('should return no problems for a text without problem macros', () => {
    expect(splitZadania(String.raw`Nájdi \(x\).`)).toStrictEqual([])
  })
})

import {latexToMarkdown} from './latexToMarkdown'
import {splitZadania} from './splitZadania'

export type ExistingProblem = {id: number; order: number; image?: string | null}

export type ImportRow = {
  order: number
  markdown: string
  warnings: string[]
  // set when the series already has a problem with this order
  existing?: ExistingProblem
}

export type SeriesImportPlan = {
  rows: ImportRow[]
  // series numbers found in the pasted file other than the one being imported into
  otherSeries: number[]
  // orders defined more than once, e.g. a file pasted twice; the last definition is used
  duplicates: number[]
  // orders whose body never closes, so they are not imported
  unclosed: number[]
}

export const planSeriesImport = (latex: string, seriesOrder: number, existing: ExistingProblem[]): SeriesImportPlan => {
  const {problems, unclosed} = splitZadania(latex)
  const existingByOrder = new Map(existing.map((problem) => [problem.order, problem]))

  // the backend allows two problems with the same order in a series, so a repeated order must not create both
  const byOrder = new Map<number, string>()
  const duplicates = new Set<number>()
  for (const problem of problems.filter(({series}) => series === seriesOrder)) {
    if (byOrder.has(problem.order)) duplicates.add(problem.order)
    byOrder.set(problem.order, problem.tex)
  }

  const rows = [...byOrder]
    .toSorted(([a], [b]) => a - b)
    .map(([order, tex]) => ({order, ...latexToMarkdown(tex), existing: existingByOrder.get(order)}))
  const otherSeries = [...new Set(problems.map(({series}) => series))].filter((series) => series !== seriesOrder)

  return {
    rows,
    otherSeries,
    duplicates: [...duplicates],
    unclosed: unclosed.filter(({series}) => series === seriesOrder).map(({order}) => order),
  }
}

import {latexToMarkdown} from './latexToMarkdown'
import {splitZadania} from './splitZadania'

export type ExistingProblem = {id: number; order: number}

export type ImportRow = {
  order: number
  markdown: string
  warnings: string[]
  // set when the series already has a problem with this order
  existingId?: number
}

export type SeriesImportPlan = {
  rows: ImportRow[]
  // series numbers found in the pasted file other than the one being imported into
  otherSeries: number[]
}

export const planSeriesImport = (latex: string, seriesOrder: number, existing: ExistingProblem[]): SeriesImportPlan => {
  const problems = splitZadania(latex)
  const existingByOrder = new Map(existing.map((problem) => [problem.order, problem.id]))

  const rows = problems
    .filter((problem) => problem.series === seriesOrder)
    .map((problem) => ({
      order: problem.order,
      ...latexToMarkdown(problem.tex),
      existingId: existingByOrder.get(problem.order),
    }))
  const otherSeries = [...new Set(problems.map((problem) => problem.series))].filter((series) => series !== seriesOrder)

  return {rows, otherSeries}
}

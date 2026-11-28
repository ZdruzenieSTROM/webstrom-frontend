import {latexToMarkdown} from './latexToMarkdown'
import {splitZadania} from './splitZadania'

export type ExistingProblem = {id: number; order: number; image?: string | null}

export type ImportRow = {
  order: number
  markdown: string
  warnings: string[]
  // pictures the LaTeX includes, which the text cannot carry
  images: string[]
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

// what the editor changed in the import dialog, kept apart from the plan so a re-planned file can drop it
export type ImportDraft = {
  latex: string
  skipped: ReadonlySet<number>
  // Markdown the editor rewrote, by order
  edits: ReadonlyMap<number, string>
  // image files the editor attached, by order
  files: ReadonlyMap<number, File>
}

export const emptyDraft: ImportDraft = {latex: '', skipped: new Set(), edits: new Map(), files: new Map()}

export type RowToSave = ImportRow & {file?: File}

// the rows to save: skipped ones left out, edited text in place of the converted one, attached files added
export const rowsToSave = (plan: SeriesImportPlan, draft: ImportDraft): RowToSave[] =>
  plan.rows
    .filter((row) => !draft.skipped.has(row.order))
    .map((row) => ({...row, markdown: draft.edits.get(row.order) ?? row.markdown, file: draft.files.get(row.order)}))

// data for the data provider's create/update: multipart only with a file, so an overwrite without a new image
// sends just the text and leaves the stored image alone
export const problemData = (row: RowToSave, fields: Record<string, string | number>) => {
  const data: Record<string, string | number> = {...fields, text: row.markdown}
  if (!row.file) return data
  // the id addresses the PATCH; it is not a field of the problem
  const {id, ...rest} = data
  const formData = new FormData()
  for (const [key, value] of Object.entries(rest)) formData.append(key, String(value))
  formData.append('image', row.file)
  return id === undefined ? {formData} : {id, formData}
}

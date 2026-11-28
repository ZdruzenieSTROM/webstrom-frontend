import {Button} from '@mui/material'
import {FC, useMemo, useState} from 'react'
import {useDataProvider, useNotify, useRefresh, useTranslate} from 'react-admin'

import {
  emptyDraft,
  ExistingProblem,
  ImportDraft,
  planSeriesImport,
  problemData,
  rowsToSave,
  RowToSave,
} from './planSeriesImport'
import {ProblemsImportDialog} from './ProblemsImportDialog'

type SeriesLatexImportProps = {
  seriesId: number
  seriesOrder: number
  existing: ExistingProblem[]
}

export const SeriesLatexImport: FC<SeriesLatexImportProps> = ({seriesId, seriesOrder, existing}) => {
  const translate = useTranslate()
  const dataProvider = useDataProvider()
  const notify = useNotify()
  const refresh = useRefresh()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ImportDraft>(emptyDraft)
  const [saving, setSaving] = useState(false)

  const plan = useMemo(() => planSeriesImport(draft.latex, seriesOrder, existing), [draft.latex, seriesOrder, existing])

  const saveRow = (row: RowToSave) =>
    row.existing === undefined
      ? dataProvider.create('competition/problem', {data: problemData(row, {series: seriesId, order: row.order})})
      : dataProvider.update('competition/problem', {
          id: row.existing.id,
          data: problemData(row, {id: row.existing.id}),
          previousData: {id: row.existing.id},
        })

  const handleSave = async (rows: RowToSave[]) => {
    setSaving(true)
    let saved = 0
    // one by one, so a failed problem is reported by its order and the rest still get saved
    for (const row of rows) {
      try {
        await saveRow(row)
        saved++
      } catch (error) {
        notify('content.notifications.series_latex_import.error', {
          type: 'error',
          messageArgs: {order: row.order, message: (error as Error).message},
        })
      }
    }
    setSaving(false)
    notify('content.notifications.series_latex_import.saved', {
      type: saved === rows.length ? 'success' : 'warning',
      messageArgs: {count: saved, total: rows.length},
    })
    refresh()
    if (saved === rows.length) {
      setDraft(emptyDraft)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{alignSelf: 'flex-start', mb: 1}}>
        {translate('content.latex_import.series_open')}
      </Button>
      <ProblemsImportDialog
        open={open}
        onClose={() => setOpen(false)}
        seriesOrder={seriesOrder}
        plan={plan}
        draft={draft}
        onDraftChange={setDraft}
        confirmLabel={translate('content.latex_import.series_apply', {count: rowsToSave(plan, draft).length})}
        onConfirm={handleSave}
        busy={saving}
      />
    </>
  )
}

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material'
import {FC, useMemo, useState} from 'react'
import {useDataProvider, useNotify, useRefresh, useTranslate} from 'react-admin'

import {ImportPlanPreview, RowAction} from './ImportPlanPreview'
import {ExistingProblem, ImportRow, planSeriesImport} from './planSeriesImport'

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
  const [latex, setLatex] = useState('')
  const [skipped, setSkipped] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)

  const plan = useMemo(() => planSeriesImport(latex, seriesOrder, existing), [latex, seriesOrder, existing])
  const toSave = plan.rows.filter((row) => !skipped.has(row.order))

  const setAction = (order: number, action: RowAction) =>
    setSkipped((current) => {
      const next = new Set(current)
      if (action === 'skip') next.add(order)
      else next.delete(order)
      return next
    })

  const saveRow = (row: ImportRow) =>
    row.existing === undefined
      ? dataProvider.create('competition/problem', {data: {series: seriesId, order: row.order, text: row.markdown}})
      : dataProvider.update('competition/problem', {
          id: row.existing.id,
          data: {id: row.existing.id, text: row.markdown},
          previousData: {id: row.existing.id},
        })

  const handleLatexChange = (value: string) => {
    setLatex(value)
    // skips are keyed by order, so they would otherwise carry over to the problems of another file
    setSkipped(new Set())
  }

  const handleSave = async () => {
    setSaving(true)
    let saved = 0
    // one by one, so a failed problem is reported by its order and the rest still get saved
    for (const row of toSave) {
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
      type: saved === toSave.length ? 'success' : 'warning',
      messageArgs: {count: saved, total: toSave.length},
    })
    refresh()
    if (saved === toSave.length) {
      handleLatexChange('')
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{alignSelf: 'flex-start', mb: 1}}>
        {translate('content.latex_import.series_open')}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>{translate('content.latex_import.series_title', {series: seriesOrder})}</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <TextField
            label={translate('content.latex_import.latex')}
            helperText={translate('content.latex_import.series_latex_helper')}
            value={latex}
            onChange={(event) => handleLatexChange(event.target.value)}
            multiline
            minRows={6}
            maxRows={12}
            fullWidth
            sx={{mt: 1}}
            slotProps={{htmlInput: {sx: {fontFamily: 'monospace'}}}}
          />
          <ImportPlanPreview
            plan={plan}
            seriesOrder={seriesOrder}
            hasInput={!!latex.trim()}
            skipped={skipped}
            onAction={setAction}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{translate('ra.action.cancel')}</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving || toSave.length === 0}>
            {translate('content.latex_import.series_apply', {count: toSave.length})}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

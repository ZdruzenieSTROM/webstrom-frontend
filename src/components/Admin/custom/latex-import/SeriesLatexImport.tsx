import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {FC, useMemo, useState} from 'react'
import {useDataProvider, useNotify, useRefresh, useTranslate} from 'react-admin'

import {SitePreview} from '@/components/Admin/custom/SitePreview'
import {ProblemContent} from '@/components/Problems/ProblemContent'

import {ExistingProblem, ImportRow, planSeriesImport} from './planSeriesImport'

type Action = 'write' | 'skip'

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

  const setAction = (order: number, action: Action) =>
    setSkipped((current) => {
      const next = new Set(current)
      if (action === 'skip') next.add(order)
      else next.delete(order)
      return next
    })

  const saveRow = (row: ImportRow) =>
    row.existingId === undefined
      ? dataProvider.create('competition/problem', {data: {series: seriesId, order: row.order, text: row.markdown}})
      : dataProvider.update('competition/problem', {
          id: row.existingId,
          data: {id: row.existingId, text: row.markdown},
          previousData: {id: row.existingId},
        })

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
    if (saved === toSave.length) setOpen(false)
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
            onChange={(event) => setLatex(event.target.value)}
            multiline
            minRows={6}
            maxRows={12}
            fullWidth
            sx={{mt: 1}}
            slotProps={{htmlInput: {sx: {fontFamily: 'monospace'}}}}
          />
          {plan.otherSeries.length > 0 && (
            <Alert severity={plan.rows.length === 0 ? 'warning' : 'info'}>
              {translate('content.latex_import.other_series', {series: plan.otherSeries.join(', ')})}
            </Alert>
          )}
          {latex.trim() && plan.rows.length === 0 && plan.otherSeries.length === 0 && (
            <Alert severity="warning">{translate('content.latex_import.no_problems', {series: seriesOrder})}</Alert>
          )}
          {plan.rows.map((row) => (
            <Box key={row.order} sx={{border: 1, borderColor: 'divider', borderRadius: 1, p: 2}}>
              <Stack direction="row" alignItems="center" gap={2} sx={{mb: 1}}>
                <Typography variant="body1" component="h3" sx={{fontWeight: 700}}>
                  {translate('content.latex_import.row_title', {order: row.order})}
                </Typography>
                <TextField
                  select
                  size="small"
                  value={skipped.has(row.order) ? 'skip' : 'write'}
                  onChange={(event) => setAction(row.order, event.target.value as Action)}
                >
                  <MenuItem value="write">
                    {translate(
                      row.existingId === undefined
                        ? 'content.latex_import.action_create'
                        : 'content.latex_import.action_overwrite',
                    )}
                  </MenuItem>
                  <MenuItem value="skip">{translate('content.latex_import.action_skip')}</MenuItem>
                </TextField>
              </Stack>
              {row.warnings.length > 0 && (
                <Alert severity="warning" sx={{mb: 1}}>
                  <Box component="ul" sx={{m: 0, pl: 2}}>
                    {row.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </Box>
                </Alert>
              )}
              <Box sx={{opacity: skipped.has(row.order) ? 0.4 : 1}}>
                <SitePreview>
                  <ProblemContent order={row.order} text={row.markdown} />
                </SitePreview>
              </Box>
            </Box>
          ))}
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

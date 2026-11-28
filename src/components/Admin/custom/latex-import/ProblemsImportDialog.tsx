import {ExpandMore, WarningAmber} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import {FC, useState} from 'react'
import {Confirm, useTranslate} from 'react-admin'

import {SitePreview} from '@/components/Admin/custom/SitePreview'
import {ProblemContent} from '@/components/Problems/ProblemContent'

import {emptyDraft, ImportDraft, ImportRow, rowsToSave, SeriesImportPlan} from './planSeriesImport'

type ProblemsImportDialogProps = {
  open: boolean
  onClose: () => void
  seriesOrder: number
  plan: SeriesImportPlan
  draft: ImportDraft
  onDraftChange: (draft: ImportDraft) => void
  confirmLabel: string
  onConfirm: (rows: ImportRow[]) => void
  busy?: boolean
}

export const ProblemsImportDialog: FC<ProblemsImportDialogProps> = ({
  open,
  onClose,
  seriesOrder,
  plan,
  draft,
  onDraftChange,
  confirmLabel,
  onConfirm,
  busy,
}) => {
  const translate = useTranslate()
  // a new file while there are edits waits here until the editor confirms losing them
  const [pendingLatex, setPendingLatex] = useState<string>()
  const rows = rowsToSave(plan, draft)

  const handleLatexChange = (latex: string) => {
    if (draft.edits.size > 0) {
      setPendingLatex(latex)
      return
    }
    // skips and edits are keyed by order, so they must not carry over to another file's problems
    onDraftChange({...emptyDraft, latex})
  }

  const setSkipped = (order: number, skipped: boolean) => {
    const next = new Set(draft.skipped)
    if (skipped) next.add(order)
    else next.delete(order)
    onDraftChange({...draft, skipped: next})
  }

  const setEdit = (row: ImportRow, markdown: string) => {
    const next = new Map(draft.edits)
    if (markdown === row.markdown) next.delete(row.order)
    else next.set(row.order, markdown)
    onDraftChange({...draft, edits: next})
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>{translate('content.latex_import.series_title', {series: seriesOrder})}</DialogTitle>
      <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <TextField
          label={translate('content.latex_import.latex')}
          helperText={translate('content.latex_import.series_latex_helper')}
          value={draft.latex}
          onChange={(event) => handleLatexChange(event.target.value)}
          multiline
          minRows={4}
          maxRows={10}
          fullWidth
          sx={{mt: 1}}
          slotProps={{htmlInput: {sx: {fontFamily: 'monospace'}}}}
        />
        {plan.otherSeries.length > 0 && (
          <Alert severity={plan.rows.length === 0 ? 'warning' : 'info'}>
            {translate('content.latex_import.other_series', {series: plan.otherSeries.join(', ')})}
          </Alert>
        )}
        {draft.latex.trim() && plan.rows.length === 0 && plan.otherSeries.length === 0 && (
          <Alert severity="warning">{translate('content.latex_import.no_problems', {series: seriesOrder})}</Alert>
        )}
        {plan.duplicates.length > 0 && (
          <Alert severity="warning">
            {translate('content.latex_import.duplicates', {orders: plan.duplicates.join(', ')})}
          </Alert>
        )}
        {plan.unclosed.length > 0 && (
          <Alert severity="warning">
            {translate('content.latex_import.unclosed', {orders: plan.unclosed.join(', ')})}
          </Alert>
        )}
        <Box>
          {plan.rows.map((row) => {
            const skipped = draft.skipped.has(row.order)
            const markdown = draft.edits.get(row.order) ?? row.markdown
            return (
              <Accordion key={row.order} disableGutters slotProps={{transition: {unmountOnExit: true}}}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  // without it the one-line text excerpt widens the row past the dialog instead of being cut
                  sx={{'& .MuiAccordionSummary-content': {minWidth: 0}}}
                >
                  <Stack direction="row" alignItems="center" gap={2} sx={{minWidth: 0, width: '100%'}}>
                    <Typography variant="body1" component="h3" sx={{fontWeight: 700, flexShrink: 0}}>
                      {translate('content.latex_import.row_title', {order: row.order})}
                    </Typography>
                    <TextField
                      select
                      size="small"
                      value={skipped ? 'skip' : 'write'}
                      onChange={(event) => setSkipped(row.order, event.target.value === 'skip')}
                      // the select sits inside the summary, whose click would toggle the row
                      onClick={(event) => event.stopPropagation()}
                      // outlined, because the admin's filled default keeps an empty label's height above the value
                      variant="outlined"
                      fullWidth={false}
                      // as wide as the longest option, so the excerpts start at the same place in every row
                      sx={{flexShrink: 0, minWidth: 140}}
                    >
                      <MenuItem value="write">
                        {translate(
                          row.existing === undefined
                            ? 'content.latex_import.action_create'
                            : 'content.latex_import.action_overwrite',
                        )}
                      </MenuItem>
                      <MenuItem value="skip">{translate('content.latex_import.action_skip')}</MenuItem>
                    </TextField>
                    {row.warnings.length > 0 && (
                      <WarningAmber
                        color="warning"
                        titleAccess={translate('content.latex_import.has_warnings')}
                        sx={{flexShrink: 0}}
                      />
                    )}
                    {draft.edits.has(row.order) && (
                      <Typography variant="body1" sx={{opacity: 0.7, flexShrink: 0}}>
                        {translate('content.latex_import.edited')}
                      </Typography>
                    )}
                    <Typography variant="body1" noWrap sx={{opacity: skipped ? 0.4 : 0.7, minWidth: 0}}>
                      {markdown.replaceAll(/\s+/g, ' ')}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                  {row.warnings.length > 0 && (
                    <Alert severity="warning">
                      <Box component="ul" sx={{m: 0, pl: 2}}>
                        {row.warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </Box>
                    </Alert>
                  )}
                  <TextField
                    label={translate('content.latex_import.markdown')}
                    value={markdown}
                    onChange={(event) => setEdit(row, event.target.value)}
                    multiline
                    fullWidth
                  />
                  <SitePreview>
                    <ProblemContent order={row.order} text={markdown} image={row.existing?.image} />
                  </SitePreview>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{translate('ra.action.cancel')}</Button>
        <Button variant="contained" onClick={() => onConfirm(rows)} disabled={busy || rows.length === 0}>
          {confirmLabel}
        </Button>
      </DialogActions>
      <Confirm
        isOpen={pendingLatex !== undefined}
        title="content.latex_import.replace_title"
        content="content.latex_import.replace_content"
        onConfirm={() => {
          onDraftChange({...emptyDraft, latex: pendingLatex ?? ''})
          setPendingLatex(undefined)
        }}
        onClose={() => setPendingLatex(undefined)}
      />
    </Dialog>
  )
}

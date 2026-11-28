import {AddPhotoAlternate, Edit} from '@mui/icons-material'
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
import {FC, useEffect, useMemo, useState} from 'react'
import {Confirm, useTranslate} from 'react-admin'

import {SitePreview} from '@/components/Admin/custom/SitePreview'
import {ProblemContent} from '@/components/Problems/ProblemContent'
import {Accept} from '@/utils/dropzoneAccept'

import {emptyDraft, ImportDraft, ImportRow, rowsToSave, RowToSave, SeriesImportPlan} from './planSeriesImport'

type ProblemsImportDialogProps = {
  open: boolean
  onClose: () => void
  seriesOrder: number
  plan: SeriesImportPlan
  draft: ImportDraft
  onDraftChange: (draft: ImportDraft) => void
  confirmLabel: string
  onConfirm: (rows: RowToSave[]) => void
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
  // a new file while there are edits or attached images waits here until the editor confirms losing them
  const [pendingLatex, setPendingLatex] = useState<string>()
  // rows whose Markdown field is open; the preview is always shown, editing is the exception
  const [editingOrders, setEditingOrders] = useState<ReadonlySet<number>>(new Set())
  const rows = rowsToSave(plan, draft)

  const replaceLatex = (latex: string) => {
    // skips, edits, files and open fields are keyed by order, so they must not carry over to another file
    onDraftChange({...emptyDraft, latex})
    setEditingOrders(new Set())
  }

  const handleLatexChange = (latex: string) => {
    if (draft.edits.size > 0 || draft.files.size > 0) setPendingLatex(latex)
    else replaceLatex(latex)
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

  const setFile = (order: number, file: File | undefined) => {
    const next = new Map(draft.files)
    if (file) next.set(order, file)
    else next.delete(order)
    onDraftChange({...draft, files: next})
  }

  const toggleEditing = (order: number) =>
    setEditingOrders((current) => {
      const next = new Set(current)
      if (next.has(order)) next.delete(order)
      else next.add(order)
      return next
    })

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
        {plan.rows.map((row) => (
          <ImportRowCard
            key={row.order}
            row={row}
            markdown={draft.edits.get(row.order) ?? row.markdown}
            edited={draft.edits.has(row.order)}
            skipped={draft.skipped.has(row.order)}
            file={draft.files.get(row.order)}
            editing={editingOrders.has(row.order)}
            onSkippedChange={(skipped) => setSkipped(row.order, skipped)}
            onMarkdownChange={(markdown) => setEdit(row, markdown)}
            onFileChange={(file) => setFile(row.order, file)}
            onToggleEditing={() => toggleEditing(row.order)}
          />
        ))}
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
          replaceLatex(pendingLatex ?? '')
          setPendingLatex(undefined)
        }}
        onClose={() => setPendingLatex(undefined)}
      />
    </Dialog>
  )
}

type ImportRowCardProps = {
  row: ImportRow
  markdown: string
  edited: boolean
  skipped: boolean
  file?: File
  editing: boolean
  onSkippedChange: (skipped: boolean) => void
  onMarkdownChange: (markdown: string) => void
  onFileChange: (file: File | undefined) => void
  onToggleEditing: () => void
}

const ImportRowCard: FC<ImportRowCardProps> = ({
  row,
  markdown,
  edited,
  skipped,
  file,
  editing,
  onSkippedChange,
  onMarkdownChange,
  onFileChange,
  onToggleEditing,
}) => {
  const translate = useTranslate()
  const fileUrl = useObjectUrl(file)
  // the LaTeX names the picture it expects; once a file is attached the hint has served its purpose
  const missingImages = file ? [] : row.images

  return (
    <Box sx={{border: 1, borderColor: 'divider', borderRadius: 1, p: 2}}>
      <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" sx={{mb: 1}}>
        <Typography variant="body1" component="h3" sx={{fontWeight: 700}}>
          {translate('content.latex_import.row_title', {order: row.order})}
        </Typography>
        <TextField
          select
          size="small"
          value={skipped ? 'skip' : 'write'}
          onChange={(event) => onSkippedChange(event.target.value === 'skip')}
          // outlined, because the admin's filled default keeps an empty label's height above the value
          variant="outlined"
          fullWidth={false}
          sx={{minWidth: 140}}
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
        {edited && (
          <Typography variant="body1" sx={{opacity: 0.7}}>
            {translate('content.latex_import.edited')}
          </Typography>
        )}
        <Stack direction="row" gap={1} sx={{ml: 'auto'}}>
          <Button component="label" startIcon={<AddPhotoAlternate />} disabled={skipped}>
            {translate(file ? 'content.latex_import.change_image' : 'content.latex_import.upload_image')}
            <input
              type="file"
              hidden
              // the same formats the problem form's image field accepts
              accept={Accept.Image['image/*'].join(',')}
              onChange={(event) => {
                onFileChange(event.target.files?.[0])
                // picking the same file again after a removal must still fire a change
                event.target.value = ''
              }}
            />
          </Button>
          {file && (
            <Button onClick={() => onFileChange(undefined)} disabled={skipped}>
              {translate('content.latex_import.remove_image')}
            </Button>
          )}
          <Button startIcon={<Edit />} onClick={onToggleEditing} disabled={skipped}>
            {translate(editing ? 'content.latex_import.hide_markdown' : 'content.latex_import.edit_markdown')}
          </Button>
        </Stack>
      </Stack>
      {row.warnings.length + missingImages.length > 0 && (
        <Alert severity="warning" sx={{mb: 1}}>
          <Box component="ul" sx={{m: 0, pl: 2}}>
            {missingImages.map((image) => (
              <li key={image}>{translate('content.latex_import.image_to_upload', {file: image})}</li>
            ))}
            {row.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </Box>
        </Alert>
      )}
      {editing && !skipped && (
        <TextField
          label={translate('content.latex_import.markdown')}
          value={markdown}
          onChange={(event) => onMarkdownChange(event.target.value)}
          multiline
          fullWidth
          sx={{mb: 1}}
        />
      )}
      <Box sx={{opacity: skipped ? 0.4 : 1}}>
        <SitePreview>
          <ProblemContent order={row.order} text={markdown} image={fileUrl ?? row.existing?.image} />
        </SitePreview>
      </Box>
    </Box>
  )
}

// a preview URL for a picked file, released when the file changes or the row goes away
const useObjectUrl = (file: File | undefined) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url)
    },
    [url],
  )
  return url
}

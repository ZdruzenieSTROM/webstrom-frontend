import {Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from '@mui/material'
import {ChangeEvent, FC, useMemo, useState} from 'react'
import {Labeled, useTranslate} from 'react-admin'
import {useFormContext} from 'react-hook-form'

import {Markdown} from '@/components/Markdown/Markdown'

import {latexToMarkdown} from './latexToMarkdown'
import {splitZadania} from './splitZadania'

type LatexImportProps = {
  source: string
}

export const LatexImport: FC<LatexImportProps> = ({source}) => {
  const translate = useTranslate()
  const {getValues, setValue} = useFormContext()
  const [open, setOpen] = useState(false)
  const [latex, setLatex] = useState('')
  const [selected, setSelected] = useState(0)

  const problems = useMemo(() => splitZadania(latex), [latex])
  // a single pasted problem has no \zad… macros around it
  const tex = problems.length > 0 ? (problems[selected]?.tex ?? '') : latex
  const result = useMemo(() => latexToMarkdown(tex), [tex])

  const handleLatexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setLatex(value)
    const order = Number(getValues('order'))
    setSelected(
      Math.max(
        0,
        splitZadania(value).findIndex((problem) => problem.order === order),
      ),
    )
  }

  const handleClose = () => setOpen(false)

  const handleApply = () => {
    setValue(source, result.markdown, {shouldDirty: true, shouldValidate: true})
    setOpen(false)
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{alignSelf: 'flex-start', mb: 1}}>
        {translate('content.latex_import.open')}
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>{translate('content.latex_import.title')}</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <TextField
            label={translate('content.latex_import.latex')}
            helperText={translate('content.latex_import.latex_helper')}
            value={latex}
            onChange={handleLatexChange}
            multiline
            minRows={6}
            maxRows={16}
            fullWidth
            sx={{mt: 1}}
            slotProps={{htmlInput: {sx: {fontFamily: 'monospace'}}}}
          />
          {problems.length > 0 && (
            <TextField
              select
              label={translate('content.latex_import.problem')}
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
            >
              {problems.map((problem, index) => (
                <MenuItem key={`${problem.series}-${problem.order}`} value={index}>
                  {translate('content.latex_import.problem_option', {series: problem.series, order: problem.order})}
                </MenuItem>
              ))}
            </TextField>
          )}
          {result.warnings.length > 0 && (
            <Alert severity="warning">
              <Box component="ul" sx={{m: 0, pl: 2}}>
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </Box>
            </Alert>
          )}
          {result.markdown && (
            <>
              <TextField
                label={translate('content.latex_import.markdown')}
                value={result.markdown}
                multiline
                fullWidth
                slotProps={{input: {readOnly: true}}}
              />
              <Labeled label="content.labels.preview">
                <Markdown content={result.markdown} />
              </Labeled>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{translate('ra.action.cancel')}</Button>
          <Button variant="contained" onClick={handleApply} disabled={!result.markdown}>
            {translate('content.latex_import.apply')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

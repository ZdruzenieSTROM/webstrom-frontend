import {Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material'
import {FC, useMemo, useState} from 'react'
import {Labeled, useTranslate} from 'react-admin'
import {useFormContext} from 'react-hook-form'

import {Markdown} from '@/components/Markdown/Markdown'

import {latexToMarkdown} from './latexToMarkdown'

type LatexImportProps = {
  source: string
}

export const LatexImport: FC<LatexImportProps> = ({source}) => {
  const translate = useTranslate()
  const {setValue} = useFormContext()
  const [open, setOpen] = useState(false)
  const [latex, setLatex] = useState('')

  const result = useMemo(() => latexToMarkdown(latex), [latex])

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
            onChange={(event) => setLatex(event.target.value)}
            multiline
            minRows={6}
            maxRows={16}
            fullWidth
            sx={{mt: 1}}
            slotProps={{htmlInput: {sx: {fontFamily: 'monospace'}}}}
          />
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

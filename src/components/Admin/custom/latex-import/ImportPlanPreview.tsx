import {Alert, Box, MenuItem, Stack, TextField, Typography} from '@mui/material'
import {FC} from 'react'
import {useTranslate} from 'react-admin'

import {SitePreview} from '@/components/Admin/custom/SitePreview'
import {ProblemContent} from '@/components/Problems/ProblemContent'

import {SeriesImportPlan} from './planSeriesImport'

export type RowAction = 'write' | 'skip'

type ImportPlanPreviewProps = {
  plan: SeriesImportPlan
  seriesOrder: number
  // whether anything was pasted, to tell an empty field from a file without this series' problems
  hasInput: boolean
  // per-row choice; without it every row is created
  skipped?: Set<number>
  onAction?: (order: number, action: RowAction) => void
}

export const ImportPlanPreview: FC<ImportPlanPreviewProps> = ({plan, seriesOrder, hasInput, skipped, onAction}) => {
  const translate = useTranslate()

  return (
    <>
      {plan.otherSeries.length > 0 && (
        <Alert severity={plan.rows.length === 0 ? 'warning' : 'info'}>
          {translate('content.latex_import.other_series', {series: plan.otherSeries.join(', ')})}
        </Alert>
      )}
      {hasInput && plan.rows.length === 0 && plan.otherSeries.length === 0 && (
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
      {plan.rows.map((row) => {
        const isSkipped = skipped?.has(row.order) ?? false
        return (
          <Box key={row.order} sx={{border: 1, borderColor: 'divider', borderRadius: 1, p: 2}}>
            <Stack direction="row" alignItems="center" gap={2} sx={{mb: 1}}>
              <Typography variant="body1" component="h3" sx={{fontWeight: 700}}>
                {translate('content.latex_import.row_title', {order: row.order})}
              </Typography>
              {onAction && (
                <TextField
                  select
                  size="small"
                  value={isSkipped ? 'skip' : 'write'}
                  onChange={(event) => onAction(row.order, event.target.value as RowAction)}
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
              )}
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
            <Box sx={{opacity: isSkipped ? 0.4 : 1}}>
              <SitePreview>
                <ProblemContent order={row.order} text={row.markdown} image={row.existing?.image} />
              </SitePreview>
            </Box>
          </Box>
        )
      })}
    </>
  )
}

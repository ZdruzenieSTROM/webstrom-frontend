import {Box, FormHelperText, FormLabel, Stack, TextField as MuiTextField} from '@mui/material'
import {FC, useEffect, useState} from 'react'
import {useInput, Validator} from 'react-admin'

import {dateTimeInputFormat, dateTimeInputParse} from '@/utils/dateTimeInputIso'

type Props = {
  source: string
  validate?: Validator | Validator[]
  label?: string
  defaultTime?: string
  helperText?: string
  disabled?: boolean
}

// Stores a single ISO UTC string in form state at `source`, same shape as MyDateTimeInput.
// Renders date + time inputs side-by-side so time can be prefilled even before date is set.
// Bratislava/UTC conversion is delegated to dateTimeInputFormat/Parse; we just split/join on 'T'.
const isoToLocal = (iso?: string) => {
  const local = dateTimeInputFormat(iso) // "yyyy-MM-dd'T'HH:mm" in Bratislava, or undefined
  if (!local) return {date: '', time: ''}
  const [date, time] = local.split('T')
  return {date, time}
}

const localToIso = (date: string, time: string) => {
  if (!date || !time) return undefined
  return dateTimeInputParse(`${date}T${time}`) ?? undefined
}

export const MyDateTimeSplitInput: FC<Props> = ({source, validate, label, defaultTime = '', helperText, disabled}) => {
  const {field, fieldState, isRequired} = useInput({source, validate})

  const initial = isoToLocal(field.value)
  const [date, setDate] = useState(initial.date)
  const [time, setTime] = useState(initial.time || defaultTime)

  // Sync from external form-state changes (e.g. prefill). `field.value` is the dependency intent.
  useEffect(() => {
    const next = isoToLocal(field.value)
    setDate(next.date)
    setTime(next.time || defaultTime)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value])

  const commit = (newDate: string, newTime: string) => {
    field.onChange(localToIso(newDate, newTime))
  }

  return (
    <Box sx={{mb: 2}}>
      {label && (
        <FormLabel required={isRequired} sx={{display: 'block', mb: 1}}>
          {label}
        </FormLabel>
      )}
      <Stack direction="row" gap={2}>
        <MuiTextField
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            commit(e.target.value, time)
          }}
          slotProps={{inputLabel: {shrink: true}}}
          label="Dátum"
          error={!!fieldState.error}
          size="small"
          disabled={disabled}
        />
        <MuiTextField
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value)
            commit(date, e.target.value)
          }}
          slotProps={{inputLabel: {shrink: true}}}
          label="Čas"
          error={!!fieldState.error}
          size="small"
          disabled={disabled}
        />
      </Stack>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {fieldState.error?.message && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
    </Box>
  )
}

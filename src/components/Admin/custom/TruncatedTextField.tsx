import {Typography} from '@mui/material'
import {FC, useState} from 'react'
import {FieldProps, useRecordContext} from 'react-admin'

type TruncatedTextFieldProps = FieldProps & {
  maxTextWidth: number
  expandable?: boolean
}

export const TruncatedTextField: FC<TruncatedTextFieldProps> = ({source, maxTextWidth, expandable = false}) => {
  const [truncate, setTruncate] = useState(true)

  const record = useRecordContext()
  if (!record || !source) return null

  const text = record[source]
  const isString = typeof text === 'string'
  const isOverLimit = isString && text.length > maxTextWidth

  const expandableProps =
    expandable && isOverLimit
      ? {
          onClick: () => setTruncate((prev) => !prev),
          sx: {cursor: 'pointer'},
        }
      : {}

  return (
    <Typography variant="body2" {...expandableProps}>
      {isOverLimit && truncate ? text.slice(0, maxTextWidth - 3) + '...' : text}
    </Typography>
  )
}

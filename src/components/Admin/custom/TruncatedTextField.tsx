import {FC} from 'react'
import {FieldProps, useRecordContext} from 'react-admin'

type TruncatedTextFieldProps = FieldProps & {
  maxTextWidth: number
}

export const TruncatedTextField: FC<TruncatedTextFieldProps> = ({source, maxTextWidth}) => {
  const record = useRecordContext()
  if (!record || !source) return null

  const text = record[source]
  const isString = typeof text === 'string'

  return <span>{isString && text.length > maxTextWidth ? text.slice(0, maxTextWidth - 3) + '...' : text}</span>
}

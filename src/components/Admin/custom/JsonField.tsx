import {FC} from 'react'
import {FieldProps, useRecordContext} from 'react-admin'

export const JsonField: FC<FieldProps> = ({source}) => {
  const record = useRecordContext()
  if (!record || !source) return null

  const value = record[source]
  const text = JSON.stringify(value, null, 2)

  return <pre>{text}</pre>
}

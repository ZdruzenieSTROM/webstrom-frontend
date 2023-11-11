import {Chip} from '@mui/material'
import {FC} from 'react'
import {FieldProps, useRecordContext} from 'react-admin'

type MyArrayFieldProps = FieldProps & {
  formatNumber?: (v: number) => string
}

export const MyArrayField: FC<MyArrayFieldProps> = ({source, formatNumber}) => {
  const record = useRecordContext()
  if (!record || !source) return null

  const array = record[source] as (string | number)[] | undefined
  if (!array || array.length === 0) return null

  return (
    <>
      {array.map((item) => (
        <Chip label={typeof item === 'number' && formatNumber ? formatNumber(item) : item} key={item} />
      ))}
    </>
  )
}

{
  /* <Labeled label="Author"></Labeled> ? */
}

import {FC} from 'react'
import {ImageField, RecordContextProvider, useRecordContext} from 'react-admin'

export const MyImageField: FC = () => {
  const record = useRecordContext()

  const myRecord = typeof record === 'string' ? {src: record} : record

  return (
    <RecordContextProvider value={myRecord}>
      <ImageField source="src" />
    </RecordContextProvider>
  )
}

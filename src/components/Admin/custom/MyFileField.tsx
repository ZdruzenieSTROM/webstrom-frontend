import {FC} from 'react'
import {FileField, RecordContextProvider, useRecordContext} from 'react-admin'

export const MyFileField: FC = () => {
  const record = useRecordContext()

  const myRecord = typeof record === 'string' ? {src: record, title: 'Vzorák'} : record

  return (
    <RecordContextProvider value={myRecord}>
      <FileField source="src" title={myRecord?.title} />
    </RecordContextProvider>
  )
}

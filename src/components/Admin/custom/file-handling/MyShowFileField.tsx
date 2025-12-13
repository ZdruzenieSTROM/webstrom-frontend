import {FC} from 'react'
// eslint-disable-next-line no-restricted-imports -- tu je to validne
import {FileField, FileFieldProps, RecordContextProvider, useRecordContext} from 'react-admin'

import {getExistingFile} from './getExistingFile'

type MyShowFileFieldProps = FileFieldProps & {
  reformatUrlFromId?: (recordId: number) => string
}

export const MyShowFileField: FC<MyShowFileFieldProps> = ({source, title, reformatUrlFromId}) => {
  // v Showe je FileField pouzity priamo, takze record je cely parent z databazy
  const record = useRecordContext()

  if (!record) return null

  const existingFile = getExistingFile(record[source], record.id, reformatUrlFromId, record[title])

  return (
    // vytvorime vlastny record context pre FileField
    <RecordContextProvider value={existingFile}>
      <FileField source="src" title="title" target="_blank" />
    </RecordContextProvider>
  )
}

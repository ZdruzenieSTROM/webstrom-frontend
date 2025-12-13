import {FC} from 'react'
// eslint-disable-next-line no-restricted-imports -- tu je to validne
import {FileInput, FileInputProps, useRecordContext} from 'react-admin'

import {getExistingFile} from './getExistingFile'
import {MyFileInputFileField} from './MyFileInputFileField'

type MyEditFileInputProps = FileInputProps & {
  reformatUrlFromId?: (recordId: number) => string
}

export const MyEditFileInput: FC<MyEditFileInputProps> = ({source, accept, reformatUrlFromId}) => {
  // cely parent record z databazy
  const record = useRecordContext()

  if (!record) return null

  const existingFile = getExistingFile(record[source], record.id, reformatUrlFromId)

  return (
    <FileInput source={source} accept={accept}>
      <MyFileInputFileField existingFile={existingFile} source="src" title="title" target="_blank" />
    </FileInput>
  )
}

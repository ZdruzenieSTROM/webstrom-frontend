import {FC} from 'react'
// eslint-disable-next-line no-restricted-imports -- tu je to validne
import {FileInput, FileInputProps} from 'react-admin'

import {MyFileInputFileField} from './MyFileInputFileField'

type MyCreateFileInputProps = FileInputProps

export const MyCreateFileInput: FC<MyCreateFileInputProps> = (props) => {
  return (
    <FileInput {...props}>
      <MyFileInputFileField source="src" title="title" target="_blank" />
    </FileInput>
  )
}

import {FC} from 'react'
import {DropzoneInputProps, DropzoneRootProps} from 'react-dropzone'

import styles from './FileDropZone.module.scss'

interface FileDropZoneProps {
  text: string
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

export const FileDropZone: FC<FileDropZoneProps> = ({text, getRootProps, getInputProps}) => {
  return (
    <div {...getRootProps({className: styles.dropzone})}>
      <input {...getInputProps()} />
      <p>{text}</p>
    </div>
  )
}

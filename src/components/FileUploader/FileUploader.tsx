import {Upload} from '@mui/icons-material'
import axios from 'axios'
import {FC, useCallback} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

interface FileUploaderProps {
  uploadLink: string
  refetch: () => void
}

export const FileUploader: FC<FileUploaderProps> = ({uploadLink, refetch}) => {
  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles) => {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      await axios.post(uploadLink, formData)
      await refetch()
    },
    [refetch, uploadLink],
  )

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Upload />
      </div>
    </>
  )
}

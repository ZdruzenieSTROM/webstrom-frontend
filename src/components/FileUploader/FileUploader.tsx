import {Upload} from '@mui/icons-material'
import axios from 'axios'
import {FC, useCallback} from 'react'
import {Accept, DropzoneOptions, useDropzone} from 'react-dropzone'

interface FileUploaderProps {
  uploadLink: string
  acceptedFormats?: Accept
  refetch: () => void
}

export const FileUploader: FC<FileUploaderProps> = ({uploadLink, acceptedFormats, refetch}) => {
  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return
      }
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      await axios.post(uploadLink, formData)
      await refetch()
    },
    [refetch, uploadLink],
  )

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFormats ?? {},
  })

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Upload />
      </div>
    </>
  )
}

import {Upload} from '@mui/icons-material'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useCallback} from 'react'
import {Accept, DropzoneOptions, useDropzone} from 'react-dropzone'

interface FileUploaderProps {
  uploadLink: string
  acceptedFormats?: Accept
  refetch: () => void
}

export const FileUploader: FC<FileUploaderProps> = ({uploadLink, acceptedFormats, refetch}) => {
  const {mutate: fileUpload} = useMutation({
    mutationFn: (formData: FormData) => axios.post(uploadLink, formData),
    onSuccess: () => refetch(),
  })

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return
      }
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      fileUpload(formData)
    },
    [fileUpload],
  )

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFormats ?? {},
  })

  return (
    <>
      <div {...getRootProps({style: {cursor: 'pointer'}})}>
        <input {...getInputProps()} />
        <Upload />
      </div>
    </>
  )
}

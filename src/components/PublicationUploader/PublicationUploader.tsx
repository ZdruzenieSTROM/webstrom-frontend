import {Upload} from '@mui/icons-material'
import axios from 'axios'
import {FC, useCallback} from 'react'
import {Accept, DropzoneOptions, useDropzone} from 'react-dropzone'

interface PublicationUploaderProps {
  uploadLink: string
  acceptedFormats?: Accept
  publication_type: string
  event: string
  order: string
  refetch: () => void
}

export const PublicationUploader: FC<PublicationUploaderProps> = ({uploadLink, acceptedFormats, publication_type, event, order, refetch}) => {
  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return
      }
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      formData.append('publication_type', publication_type)
      formData.append('event', event)
      formData.append('order', order)
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

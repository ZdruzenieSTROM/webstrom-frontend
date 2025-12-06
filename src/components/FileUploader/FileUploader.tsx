import {Upload} from '@mui/icons-material'
import {useMutation} from '@tanstack/react-query'
import {FC, useCallback} from 'react'
import {Accept, DropzoneOptions, useDropzone} from 'react-dropzone'

import {apiAxios} from '@/api/apiAxios'

interface FileUploaderProps {
  uploadLink: string
  acceptedFormats?: Accept
  adjustFormData?: (formData: FormData) => void
  refetch: () => void
  alreadyUploaded?: boolean
}

export const FileUploader: FC<FileUploaderProps> = ({
  uploadLink,
  acceptedFormats,
  adjustFormData,
  refetch,
  alreadyUploaded,
}) => {
  const postMutation = useMutation({
    mutationFn: (formData: FormData) => apiAxios.post(uploadLink, formData),
    onSuccess: () => refetch(),
  })

  const patchMutation = useMutation({
    mutationFn: (formData: FormData) => apiAxios.patch(uploadLink, formData),
    onSuccess: () => refetch(),
  })

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) return
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      adjustFormData?.(formData)

      if (alreadyUploaded) {
        patchMutation.mutate(formData)
      } else {
        postMutation.mutate(formData)
      }
    },
    [adjustFormData, alreadyUploaded, postMutation, patchMutation],
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

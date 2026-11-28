import {Upload} from '@mui/icons-material'
import {CircularProgress} from '@mui/material'
import {useMutation, UseMutationOptions} from '@tanstack/react-query'
import {FC, useCallback} from 'react'
import {Accept, DropzoneOptions, useDropzone} from 'react-dropzone'

interface FileUploaderProps {
  uploadOptions: UseMutationOptions<unknown, Error, FormData>
  acceptedFormats?: Accept
  adjustFormData?: (formData: FormData) => void
  refetch: () => void
  testId?: string
}

export const FileUploader: FC<FileUploaderProps> = ({
  uploadOptions,
  acceptedFormats,
  adjustFormData,
  refetch,
  testId,
}) => {
  const {mutate, isPending} = useMutation({
    ...uploadOptions,
    onSuccess: () => refetch(),
  })

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) return
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      adjustFormData?.(formData)
      mutate(formData)
    },
    [adjustFormData, mutate],
  )

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFormats ?? {},
  })

  return (
    <div {...getRootProps({style: {cursor: isPending ? 'wait' : 'pointer'}})} data-testid={testId}>
      <input {...getInputProps()} />
      {isPending ? <CircularProgress size={24} color="inherit" /> : <Upload />}
    </div>
  )
}

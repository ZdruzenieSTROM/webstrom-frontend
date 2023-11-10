import {Upload} from '@mui/icons-material'
import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useCallback} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {SemesterWithProblems} from '@/types/api/generated/competition'

import {Link} from '../Clickable/Clickable'

interface PublicationUploaderProps {
  semesterId: string
  order: number
  semesterData: SemesterWithProblems | undefined
}

export const PublicationUploader: FC<PublicationUploaderProps> = ({semesterId, order, semesterData}) => {
  const queryClient = useQueryClient()

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return
      }
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      formData.append('publication_type', 'Časopisy')
      formData.append('event', semesterId)
      formData.append('order', order.toString())
      await axios.post('/api/competition/publication/upload/', formData)
      await queryClient.invalidateQueries({queryKey: ['competition', 'semester', semesterId]})
    },
    [semesterId, order, queryClient],
  )
  const publication = semesterData?.publication_set.find((publication) => publication.order === order)

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept:
      {
        'application/pdf': ['.pdf'],
      } ?? {},
  })

  return (
    <>
      <h4> {order}.Časopis: </h4>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Upload />
      </div>
      {}
      {publication && (
        <Link key={publication.id} href={`/api/competition/publication/${publication.id}/download`}>
          {publication.name}
        </Link>
      )}
    </>
  )
}

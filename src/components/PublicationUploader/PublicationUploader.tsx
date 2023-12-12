import {Stack, Typography} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {FC} from 'react'

import {SemesterWithProblems} from '@/types/api/generated/competition'

import {Link} from '../Clickable/Link'
import {FileUploader} from '../FileUploader/FileUploader'

interface PublicationUploaderProps {
  semesterId: number
  order: number
  semesterData: SemesterWithProblems
}

export const PublicationUploader: FC<PublicationUploaderProps> = ({semesterId, order, semesterData}) => {
  const queryClient = useQueryClient()

  const refetch = () => queryClient.invalidateQueries({queryKey: ['competition', 'semester', semesterId]})

  const appendFormData = (formData: FormData) => {
    formData.append('publication_type', 'Časopisy')
    formData.append('event', semesterId.toString())
    formData.append('order', order.toString())
  }

  const publication = semesterData.publication_set.find((publication) => publication.order === order)

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Typography variant="body1">{order}. Časopis:</Typography>
      {publication && (
        <Link variant="button2" href={`/api/competition/publication/${publication.id}/download`}>
          {publication.name}.pdf
        </Link>
      )}
      <FileUploader
        uploadLink={'/api/competition/publication/upload/'}
        acceptedFormats={{'application/pdf': ['.pdf']}}
        adjustFormData={appendFormData}
        refetch={refetch}
      />
    </Stack>
  )
}

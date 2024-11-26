import {Stack, Typography} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {FC} from 'react'

import {PublicationTypes} from '@/types/api/competition'
import {SemesterWithProblems} from '@/types/api/generated/competition'
import {Accept} from '@/utils/dropzone-accept'

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
    formData.append('publication_type', PublicationTypes.LEAFLET.name)
    formData.append('event', semesterId.toString())
    formData.append('order', order.toString())
  }

  const publication = semesterData.publication_set.find((publication) => publication.order === order)

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Typography variant="body1">{order}. Časopis:</Typography>
      {publication && (
        <Link variant="button2" href={`/api/competition/publication/${publication.id}/download`}>
          {publication.name}
        </Link>
      )}
      <FileUploader
        uploadLink={'/api/competition/publication/upload/'}
        acceptedFormats={Accept.Pdf}
        adjustFormData={appendFormData}
        refetch={refetch}
      />
    </Stack>
  )
}

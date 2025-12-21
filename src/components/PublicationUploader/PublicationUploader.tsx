import {Stack, Typography} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {FC} from 'react'

import {PublicationTypes, SemesterWithProblems} from '@/types/api/competition'
import {Accept} from '@/utils/dropzoneAccept'

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
    formData.append('publication_type', PublicationTypes.LEAFLET.id.toString())
    formData.append('event', semesterId.toString())
    formData.append('order', order.toString())
  }

  const publication = semesterData.publication_set.find((publication) => publication.order === order)

  const uploadLink = publication ? `/competition/publication/${publication.id}/` : `/competition/publication/`

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Typography variant="body1">{order}. Časopis:</Typography>
      {publication && (
        <Link variant="button2" href={publication.file} target="_blank">
          {publication.name}
        </Link>
      )}
      <FileUploader
        uploadLink={uploadLink}
        acceptedFormats={Accept.Pdf}
        adjustFormData={appendFormData}
        refetch={refetch}
        alreadyUploaded={!!publication}
      />
    </Stack>
  )
}

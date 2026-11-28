import {Stack, Typography} from '@mui/material'
import {useQueryClient} from '@tanstack/react-query'
import {FC} from 'react'

import {apiOptions} from '@/api/api'
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

  const uploadOptions = publication
    ? apiOptions.competition.publication.update(publication.id)
    : apiOptions.competition.publication.create()

  return (
    <Stack direction="row" gap={2} alignItems="center">
      <Typography variant="body1">{order}. Časopis:</Typography>
      {publication && (
        <Link variant="button2" href={publication.file}>
          {publication.name}
        </Link>
      )}
      <FileUploader
        uploadOptions={uploadOptions}
        acceptedFormats={Accept.Pdf}
        adjustFormData={appendFormData}
        refetch={refetch}
      />
    </Stack>
  )
}

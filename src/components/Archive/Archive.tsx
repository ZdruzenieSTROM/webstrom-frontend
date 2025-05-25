import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiAxios} from '@/api/apiAxios'
import {Event, Publication} from '@/types/api/competition'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Link} from '../Clickable/Link'
import {Loading} from '../Loading/Loading'

// TODO: check whether we can safely assume presence of these and either update it on BE so it gets generated that way, or update it in our `types/api/competition`
type MyPublication = Publication & {
  name: string
}
type MyEvent = Omit<Event, 'publication_set'> & {
  year: number
  school_year: string
  publication_set: MyPublication[]
}

const PublicationButton: FC<{
  publication: Publication
}> = ({publication}) => {
  return (
    <Link variant="button2" href={publication.file} target="_blank">
      {publication.name}
    </Link>
  )
}

const ResultsButton: FC<{
  eventYear: number
  eventSeason: number
}> = ({eventYear, eventSeason}) => {
  const season = eventSeason === 0 ? 'zima' : 'leto'
  const url = `../poradie/${eventYear}/${season}`
  return (
    <Link variant="button2" href={url}>
      Poradie
    </Link>
  )
}

const ProblemsButton: FC<{
  eventYear: number
  eventSeason: number
}> = ({eventYear, eventSeason}) => {
  const season = eventSeason === 0 ? 'zima' : 'leto'
  const url = `../zadania/${eventYear}/${season}/1`
  return (
    <Link variant="button2" href={url}>
      Zadania
    </Link>
  )
}

export const Archive: FC = () => {
  const {seminarId} = useSeminarInfo()

  const {data: eventListData, isLoading: eventListIsLoading} = useQuery({
    queryKey: ['competition', 'event', `competition=${seminarId}`],
    queryFn: () => apiAxios.get<MyEvent[]>(`/competition/event/?competition=${seminarId}`),
  })
  const eventList = eventListData?.data ?? []

  return (
    <Stack gap={2.5}>
      {eventListIsLoading && <Loading />}
      {eventList.map((event) => (
        <Stack key={event.id} direction="row" justifyContent="space-between">
          <Typography variant="h3" component="span">
            {event.year + '. ročník '}
            {event.season_code === 0 ? 'zimný' : 'letný'}
            {' semester'}
          </Typography>
          <Stack gap={2} direction="row" alignItems="center">
            <ResultsButton eventYear={event.year} eventSeason={event.season_code} />
            <ProblemsButton eventYear={event.year} eventSeason={event.season_code} />
            {event.publication_set.map((publication) => (
              <PublicationButton key={publication.id} publication={publication} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}

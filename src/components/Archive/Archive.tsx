import {ExpandMore} from '@mui/icons-material'
import {Accordion, AccordionDetails, AccordionSummary, Stack, SxProps, Typography} from '@mui/material'
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
  sx?: SxProps
}> = ({eventYear, eventSeason, sx}) => {
  const season = eventSeason === 0 ? 'zima' : 'leto'
  const url = `/poradie/${eventYear}/${season}`
  return (
    <Link variant="button2" href={url} sx={sx}>
      Poradie
    </Link>
  )
}

const ProblemsButton: FC<{
  eventYear: number
  eventSeason: number
  sx?: SxProps
}> = ({eventYear, eventSeason, sx}) => {
  const season = eventSeason === 0 ? 'zima' : 'leto'
  const url = `/zadania/${eventYear}/${season}/1`
  return (
    <Link variant="button2" href={url} sx={sx}>
      Zadania
    </Link>
  )
}

const showInSummary = {display: {xs: 'none', sm: 'flex', md: 'none', lg: 'flex'}}
const showInDetails = {display: {xs: 'flex', sm: 'none', md: 'flex', lg: 'none'}}
const alignEndInDetails = {
  justifyContent: {sm: 'end', md: 'unset', lg: 'end'},
  pr: {sm: '35px', md: 'unset', lg: '35px'},
}

export const Archive: FC = () => {
  const {seminarId} = useSeminarInfo()

  const {data: eventListData, isLoading: eventListIsLoading} = useQuery({
    queryKey: ['competition', 'event', `competition=${seminarId}`],
    queryFn: () => apiAxios.get<MyEvent[]>(`/competition/event/?competition=${seminarId}`),
  })
  const eventList = eventListData?.data ?? []

  return (
    <Stack gap={1}>
      {eventListIsLoading && <Loading />}

      {eventList.map((event) => (
        <Accordion key={event.id} disableGutters square={false} sx={{boxShadow: 'none', '&:before': {display: 'none'}}}>
          <AccordionSummary expandIcon={<ExpandMore color="primary" fontSize="large" />} sx={{p: 0}}>
            <Stack direction="row" sx={{flexGrow: 1}}>
              <Typography variant="h2" sx={{flexGrow: 1}}>
                {event.year + '. ročník ' + (event.season_code === 0 ? 'zimný' : 'letný') + ' semester'}
              </Typography>
              <ResultsButton eventYear={event.year} eventSeason={event.season_code} sx={showInSummary} />
              <ProblemsButton eventYear={event.year} eventSeason={event.season_code} sx={showInSummary} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{p: 0}}>
            <Stack direction="row" sx={{flexWrap: 'wrap', rowGap: 0.5, ...alignEndInDetails}}>
              <ResultsButton eventYear={event.year} eventSeason={event.season_code} sx={showInDetails} />
              <ProblemsButton eventYear={event.year} eventSeason={event.season_code} sx={showInDetails} />
              {event.publication_set.map((publication) => (
                <PublicationButton key={publication.id} publication={publication} />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

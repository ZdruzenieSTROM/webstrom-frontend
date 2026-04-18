import {ExpandMore} from '@mui/icons-material'
import {Accordion, AccordionDetails, AccordionSummary, Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiAxios} from '@/api/apiAxios'
import {Gallery} from '@/types/api/cms'
import {Event, Publication, PublicationTypes} from '@/types/api/competition'
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
  galleries: Gallery[]
}

type YearGroup = {
  year: number
  schoolYear: string | null
  events: MyEvent[]
}

const getSeasonSlug = (eventSeason: number) => {
  return eventSeason === 0 ? 'zima' : 'leto'
}

const getSeasonLabel = (eventSeason: number) => {
  return eventSeason === 0 ? 'zimný semester' : 'letný semester'
}

const GalleryButton: FC<{
  gallery: Gallery
}> = ({gallery}) => {
  return (
    <Link variant="button2" href={gallery.gallery_link}>
      {gallery.name}
    </Link>
  )
}

const PublicationButton: FC<{
  publication?: Publication
  label?: string
}> = ({publication, label}) => {
  return (
    <Link
      variant="button2"
      disabled={!publication}
      href={publication?.file || '#'}
    >
      {label ?? publication?.name}
    </Link>
  )
}

const getLeafletPublication = (event: MyEvent, order: number) => {
  return event.publication_set.find(
    (publication) => publication.publication_type === PublicationTypes.LEAFLET.id && publication.order === order,
  )
}

const getYearGroups = (eventList: MyEvent[]): YearGroup[] => {
  const groups = new Map<number, YearGroup>()

  for (const event of eventList) {
    const existingGroup = groups.get(event.year)

    if (existingGroup) {
      existingGroup.events.push(event)
      continue
    }

    groups.set(event.year, {
      year: event.year,
      schoolYear: event.school_year,
      events: [event],
    })
  }

  return [...groups.values()]
    .toSorted((leftGroup, rightGroup) => rightGroup.year - leftGroup.year)
    .map((group) => ({
      ...group,
      events: group.events.toSorted((leftEvent, rightEvent) => leftEvent.season_code - rightEvent.season_code),
    }))
}

const ResultsButton: FC<{
  eventYear: number
  eventSeason: number
}> = ({eventYear, eventSeason}) => {
  const season = getSeasonSlug(eventSeason)
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
  seriesOrder: 1 | 2
}> = ({eventYear, eventSeason, seriesOrder}) => {
  const season = getSeasonSlug(eventSeason)
  const url = `../zadania/${eventYear}/${season}/${seriesOrder}`
  return (
    <Link variant="button2" href={url}>
      Zadania
    </Link>
  )
}

const ArchiveRow: FC<{
  label: string
  children: React.ReactNode
  indented?: boolean
}> = ({label, children, indented = false}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={1}
      sx={{pl: indented ? 2 : 0}}
    >
      <Typography variant="h3">{label}</Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="flex-end" gap={0.5}>
        {children}
      </Stack>
    </Stack>
  )
}

export const Archive: FC = () => {
  const {seminarId} = useSeminarInfo()

  const {data: eventListData, isLoading: eventListIsLoading} = useQuery({
    queryKey: ['competition', 'event', `competition=${seminarId}`],
    queryFn: () => apiAxios.get<MyEvent[]>(`/competition/event/?competition=${seminarId}`),
  })
  const eventList = eventListData?.data ?? []
  const yearGroups = getYearGroups(eventList)

  return (
    <Stack gap={1}>
      {eventListIsLoading && <Loading />}

      {yearGroups.map((group) => (
        <Accordion
          key={group.year}
          disableGutters
          square={false}
          sx={{boxShadow: 'none', '&:before': {display: 'none'}}}
        >
          <AccordionSummary expandIcon={<ExpandMore color="primary" fontSize="large" />} sx={{p: 0}}>
            <Stack direction="row" sx={{flexGrow: 1}}>
              <Typography variant="h2" sx={{flexGrow: 1}}>
                {group.year + '. ročník' + (group.schoolYear ? ` \u2013 ${group.schoolYear}` : '')}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{p: 0}}>
            <Stack gap={2}>
              {group.events.map((event) => {
                const seasonLeaflet = getLeafletPublication(event, 1)
                const firstSeriesLeaflet = getLeafletPublication(event, 2)
                const secondSeriesLeaflet = getLeafletPublication(event, 3)

                return (
                  <Stack key={event.id} gap={1}>
                    <ArchiveRow label={getSeasonLabel(event.season_code)}>
                      {seasonLeaflet && <PublicationButton publication={seasonLeaflet} label="Časopis" />}
                      <ResultsButton eventYear={event.year} eventSeason={event.season_code} />
                    </ArchiveRow>
                    <ArchiveRow label="1. séria" indented>
                      <ProblemsButton eventYear={event.year} eventSeason={event.season_code} seriesOrder={1} />
                      <PublicationButton publication={firstSeriesLeaflet} label="Riešenia" />
                    </ArchiveRow>
                    <ArchiveRow label="2. séria" indented>
                      <ProblemsButton eventYear={event.year} eventSeason={event.season_code} seriesOrder={2} />
                      <PublicationButton publication={secondSeriesLeaflet} label="Riešenia" />
                    </ArchiveRow>
                    {event.galleries.length > 0 && (
                      <ArchiveRow label="Sústredenie" indented>
                        {event.galleries.map((gallery) => (
                          <GalleryButton key={gallery.id} gallery={gallery} />
                        ))}
                      </ArchiveRow>
                    )}
                  </Stack>
                )
              })}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

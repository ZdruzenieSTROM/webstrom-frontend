import {
  AssignmentOutlined,
  AssignmentTurnedInOutlined,
  EmojiEventsOutlined,
  ExpandMore,
  MenuBookOutlined,
  PhotoLibraryOutlined,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  SvgIconProps,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {ComponentType, FC} from 'react'

import {apiOptions} from '@/api/api'
import {colors} from '@/theme/colors'
import {Event, Publication, PublicationTypes} from '@/types/api/competition'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Link} from '../Clickable/Link'
import {Loading} from '../Loading/Loading'

type YearGroup = {
  year: number
  schoolYear: string | null
  events: Event[]
}

const getSeasonSlug = (eventSeason: number) => {
  return eventSeason === 0 ? 'zima' : 'leto'
}

const getSeasonLabel = (eventSeason: number) => {
  return eventSeason === 0 ? 'zimný semester' : 'letný semester'
}

const getResultsUrl = (eventYear: number, eventSeason: number) => {
  return `../poradie/${eventYear}/${getSeasonSlug(eventSeason)}`
}

const getProblemsUrl = (eventYear: number, eventSeason: number, seriesOrder: 1 | 2) => {
  return `../zadania/${eventYear}/${getSeasonSlug(eventSeason)}/${seriesOrder}`
}

const getArchiveButtonSx = (disabled = false): SxProps<Theme> => {
  return {
    '.archive-row:hover &': {
      '--bgcolor': colors.black,
      '--color': disabled ? colors.gray : colors.white,
      bgcolor: colors.black,
      color: disabled ? colors.gray : colors.white,
    },
    '.archive-row:hover &:hover': {
      '--bgcolor': disabled ? colors.gray : colors.white,
      '--color': disabled ? colors.white : colors.black,
      bgcolor: disabled ? colors.gray : colors.white,
      color: disabled ? colors.white : colors.black,
    },
  }
}

type ButtonKind = 'magazine' | 'results' | 'problems' | 'solutions' | 'photos'

const buttonConfig: Record<ButtonKind, {label: string; Icon: ComponentType<SvgIconProps>}> = {
  magazine: {label: 'Časopis', Icon: MenuBookOutlined},
  results: {label: 'Poradie', Icon: EmojiEventsOutlined},
  problems: {label: 'Zadania', Icon: AssignmentOutlined},
  solutions: {label: 'Riešenia', Icon: AssignmentTurnedInOutlined},
  photos: {label: 'Fotky', Icon: PhotoLibraryOutlined},
}

const ButtonContent: FC<{kind: ButtonKind}> = ({kind}) => {
  const {label, Icon} = buttonConfig[kind]
  return (
    <Box component="span" sx={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}>
      <Icon aria-hidden sx={{fontSize: '1em'}} />
      {label}
    </Box>
  )
}

const ArchiveActionButton: FC<{
  href: string
  kind: ButtonKind
}> = ({href, kind}) => {
  return (
    <Link variant="button2" href={href} sx={getArchiveButtonSx()}>
      <ButtonContent kind={kind} />
    </Link>
  )
}

const PublicationButton: FC<{
  publication?: Publication
  kind: ButtonKind
}> = ({publication, kind}) => {
  return (
    <Link
      variant="button2"
      disabled={!publication}
      href={publication?.file || '#'}
      sx={getArchiveButtonSx(!publication)}
    >
      <ButtonContent kind={kind} />
    </Link>
  )
}

// BE convention: LEAFLET (id=4) is overloaded — order=1 is the season magazine ("Časopis"),
// order=2 is solutions of series 1 and order=3 is solutions of series 2. PublicationTypes.SOLUTIONS
// exists in the schema but is intentionally unused here.
const getLeafletPublication = (event: Event, order: number) => {
  return event.publication_set.find(
    (publication) => publication.publication_type === PublicationTypes.LEAFLET.id && publication.order === order,
  )
}

const getYearGroups = (eventList: Event[]): YearGroup[] => {
  const groups = new Map<number, YearGroup>()

  for (const event of eventList) {
    if (event.year === null) continue

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

const ArchiveRow: FC<{
  label: string
  children: React.ReactNode
  indented?: boolean
  gap?: number | string
}> = ({label, children, indented = false, gap = 0.5}) => {
  return (
    <Stack
      className="archive-row"
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={1}
      sx={{
        pl: indented ? 3 : 1,
        pr: 1,
        py: 0.5,
        '&:hover': {
          bgcolor: colors.black,
          color: colors.white,
        },
      }}
    >
      <Typography variant="h3">{label}</Typography>
      <Stack direction="row" flexWrap="wrap" justifyContent="flex-end" gap={gap}>
        {children}
      </Stack>
    </Stack>
  )
}

export const Archive: FC = () => {
  const {seminarId} = useSeminarInfo()

  const {data: eventListData, isLoading: eventListIsLoading} = useQuery(apiOptions.competition.event(seminarId))
  const eventList = eventListData ?? []
  const yearGroups = getYearGroups(eventList)

  return (
    <Stack gap={1}>
      {eventListIsLoading && <Loading />}

      {yearGroups.map((group, index) => (
        <Accordion
          key={group.year}
          defaultExpanded={index === 0}
          disableGutters
          sx={{boxShadow: 'none', '&:before': {display: 'none'}}}
        >
          <AccordionSummary expandIcon={<ExpandMore color="primary" fontSize="large" />} sx={{p: 0}}>
            <Typography variant="h2" sx={{flexGrow: 1}}>
              {group.year + '. ročník' + (group.schoolYear ? ` \u2013 ${group.schoolYear}` : '')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{p: 0}}>
            <Stack gap={1}>
              {group.events.map((event) => {
                const seasonLeaflet = getLeafletPublication(event, 1)
                const firstSeriesLeaflet = getLeafletPublication(event, 2)
                const secondSeriesLeaflet = getLeafletPublication(event, 3)
                const firstGallery = event.galleries[0]

                return (
                  <Stack key={event.id}>
                    {/* 7px keeps season-row buttons aligned with the series rows below */}
                    <ArchiveRow label={getSeasonLabel(event.season_code)} gap={'7px'}>
                      {seasonLeaflet && <PublicationButton publication={seasonLeaflet} kind="magazine" />}
                      <ArchiveActionButton href={getResultsUrl(group.year, event.season_code)} kind="results" />
                    </ArchiveRow>
                    <ArchiveRow label="1. séria" indented>
                      <ArchiveActionButton href={getProblemsUrl(group.year, event.season_code, 1)} kind="problems" />
                      <PublicationButton publication={firstSeriesLeaflet} kind="solutions" />
                    </ArchiveRow>
                    <ArchiveRow label="2. séria" indented>
                      <ArchiveActionButton href={getProblemsUrl(group.year, event.season_code, 2)} kind="problems" />
                      <PublicationButton publication={secondSeriesLeaflet} kind="solutions" />
                    </ArchiveRow>
                    {firstGallery && (
                      <ArchiveRow label="Sústredenie" indented>
                        <ArchiveActionButton href={firstGallery.gallery_link} kind="photos" />
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

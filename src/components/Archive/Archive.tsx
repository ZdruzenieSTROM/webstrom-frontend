import {ExpandMore} from '@mui/icons-material'
import {Accordion, AccordionDetails, AccordionSummary, Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiOptions} from '@/api/api'
import {Event, PublicationTypes} from '@/types/api/competition'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {ArchiveButton, ArchiveRow} from './ArchiveRow'

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

export const Archive: FC = () => {
  const {seminarId} = useSeminarInfo()

  const {data: eventList = []} = useQuery(apiOptions.competition.event.list(seminarId))
  const yearGroups = getYearGroups(eventList)

  return (
    <Stack gap={1}>
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
                      {seasonLeaflet && <ArchiveButton kind="magazine" href={seasonLeaflet.file} />}
                      <ArchiveButton kind="results" href={getResultsUrl(group.year, event.season_code)} />
                    </ArchiveRow>
                    <ArchiveRow label="1. séria" indented>
                      <ArchiveButton kind="problems" href={getProblemsUrl(group.year, event.season_code, 1)} />
                      <ArchiveButton kind="solutions" href={firstSeriesLeaflet?.file} />
                    </ArchiveRow>
                    <ArchiveRow label="2. séria" indented>
                      <ArchiveButton kind="problems" href={getProblemsUrl(group.year, event.season_code, 2)} />
                      <ArchiveButton kind="solutions" href={secondSeriesLeaflet?.file} />
                    </ArchiveRow>
                    {firstGallery && (
                      <ArchiveRow label="Sústredenie" indented>
                        <ArchiveButton kind="photos" href={firstGallery.gallery_link} />
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

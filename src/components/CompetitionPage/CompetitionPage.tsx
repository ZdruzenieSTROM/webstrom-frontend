import {Stack, SxProps, Theme, Typography} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {ArchiveButton, ArchiveRow} from '@/components/Archive/ArchiveRow'
import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {Competition, Event, PublicationTypes} from '@/types/api/competition'

import {UpcomingOrCurrentEventInfo} from './UpcomingOrCurrentEventInfo'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
}

const VISIBLE_HISTORY_EVENTS = 15

const getPublication = (event: Event, publicationType: number) => {
  return event.publication_set.find((publication) => publication.publication_type === publicationType)
}

// e.g. "22. ročník \u2013 2023/2024 (Prešovský)", same separator as /archiv year headings
const getHistoryTitle = (event: Event, competitionName: string) => {
  const yearLabel = [event.year === null ? null : `${event.year}. ročník`, event.school_year]
    .filter(Boolean)
    .join(' \u2013 ')

  if (!yearLabel) return event.additional_name || competitionName

  return event.additional_name ? `${yearLabel} (${event.additional_name})` : yearLabel
}

// On mobile every group gets its own right aligned line: title, publications, galleries
const historyButtonGroupSx: SxProps<Theme> = {flexBasis: {xs: '100%', sm: 'auto'}, justifyContent: 'flex-end'}

export const CompetitionPage: FC<CompetitionPageProps> = ({
  competition: {
    competition_type,
    name,
    who_can_participate,
    description,
    upcoming_or_current_event,
    history_events,
    rules,
    long_description,
  },
}) => {
  const router = useRouter()
  const detailsLink = long_description && `${router.asPath}/podrobnosti`
  const rulesLink = rules && `${router.asPath}/pravidla`
  const [showAllHistory, setShowAllHistory] = useState<boolean>(false)
  // history_events come from BE ordered from the newest
  const visibleHistoryEvents = showAllHistory ? history_events : history_events.slice(0, VISIBLE_HISTORY_EVENTS)

  return (
    <Stack gap={5}>
      <Typography variant="body1">
        {description}
        {who_can_participate &&
          competition_type?.short_name === 'tábor' &&
          ` Tábor je určený pre ${who_can_participate}.`}
        {who_can_participate &&
          competition_type?.short_name === 'súťaž' &&
          ` Súťaž je určená pre ${who_can_participate}.`}
        {who_can_participate &&
          competition_type?.short_name === 'seminár' &&
          ` Seminár je určený pre ${who_can_participate}.`}
      </Typography>

      {(detailsLink || rulesLink) && (
        <Stack
          direction="row"
          sx={{
            mt: 0.5,
            gap: 0.5,
            justifyContent: 'end',
          }}
        >
          {detailsLink && (
            <Link variant="button2" href={detailsLink}>
              Podrobnosti
            </Link>
          )}
          {rulesLink && (
            <Link variant="button2" href={rulesLink}>
              Pravidlá
            </Link>
          )}
        </Stack>
      )}

      <Stack gap={2}>
        {upcoming_or_current_event ? (
          <UpcomingOrCurrentEventInfo
            event={upcoming_or_current_event}
            name={name}
            shortName={competition_type?.short_name}
          />
        ) : (
          <Typography variant="body1" sx={{marginTop: 1}}>
            Ďalší ročník aktuálne pripravujeme
          </Typography>
        )}
      </Stack>

      <Stack gap={1}>
        {visibleHistoryEvents.map((event) => (
          <ArchiveRow
            key={event.id}
            label={getHistoryTitle(event, name)}
            labelVariant="h2"
            sx={{flexWrap: {xs: 'wrap', sm: 'nowrap'}}}
            labelSx={{flex: {xs: '1 1 100%', sm: '0 1 auto'}}}
            // row-reverse: publications stay at the right edge, galleries wrap below them as a whole
            buttonsSx={{
              flexDirection: 'row-reverse',
              justifyContent: 'flex-start',
              flex: {xs: '1 1 100%', sm: '1 1 0'},
            }}
          >
            <Stack direction="row" flexWrap={{xs: 'wrap', sm: 'nowrap'}} gap={0.5} sx={historyButtonGroupSx}>
              <ArchiveButton kind="problems" href={getPublication(event, PublicationTypes.PROBLEMS.id)?.file} />
              <ArchiveButton kind="solutions" href={getPublication(event, PublicationTypes.SOLUTIONS.id)?.file} />
              <ArchiveButton kind="results" href={getPublication(event, PublicationTypes.RESULTS.id)?.file} />
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={0.5} sx={historyButtonGroupSx}>
              {event.galleries.length > 0 ? (
                event.galleries.map((gallery) => (
                  <ArchiveButton
                    key={gallery.id}
                    kind="photos"
                    href={gallery.gallery_link}
                    label={gallery.name || 'Fotky'}
                  />
                ))
              ) : (
                <ArchiveButton kind="photos" />
              )}
            </Stack>
          </ArchiveRow>
        ))}
        {!showAllHistory && history_events.length > VISIBLE_HISTORY_EVENTS && (
          <Stack direction="row" justifyContent="flex-end">
            <Button type="button" variant="button2" onClick={() => setShowAllHistory(true)}>
              Zobraziť staršie
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

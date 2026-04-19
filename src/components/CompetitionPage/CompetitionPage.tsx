import {Stack, Typography} from '@mui/material'
import {useRouter} from 'next/router'
import {FC} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Competition, Event, Publication, PublicationTypes} from '@/types/api/competition'

import {UpcomingOrCurrentEventInfo} from './UpcomingOrCurrentEventInfo'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
}

type HistoryPublicationButtonsProps = {
  problems?: Publication
  solutions?: Publication
  results?: Publication
}

const getHistoryTitle = (event: Event) => {
  return `${event.year}. ročník \u2013 ${event.school_year}${event.additional_name ? ` (${event.additional_name})` : ''}`
}

const HistoryPublicationButtons: FC<HistoryPublicationButtonsProps> = ({problems, solutions, results}) => {
  return (
    <>
      <Link variant="button2" href={problems?.file} disabled={!problems}>
        Zadania
      </Link>
      <Link variant="button2" href={solutions?.file} disabled={!solutions}>
        Riešenia
      </Link>
      <Link variant="button2" href={results?.file} disabled={!results}>
        Poradie
      </Link>
    </>
  )
}

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
        {history_events.map((event) => {
          const results = event.publication_set.find((p) => p.publication_type === PublicationTypes.RESULTS.id)
          const solutions = event.publication_set.find((p) => p.publication_type === PublicationTypes.SOLUTIONS.id)
          const problems = event.publication_set.find((p) => p.publication_type === PublicationTypes.PROBLEMS.id)

          return (
            <Stack key={event.id} gap={1} sx={{px: 1, py: 0.5}}>
              <Stack
                direction={{xs: 'column', sm: 'row'}}
                justifyContent="space-between"
                alignItems={{xs: 'stretch', sm: 'flex-end'}}
                gap={1}
              >
                <Typography variant="h2" component="span" sx={{flexGrow: 1, minWidth: 0}}>
                  {getHistoryTitle(event)}
                </Typography>
                <Stack
                  direction="row"
                  flexWrap="nowrap"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  gap={0.5}
                  sx={{display: {xs: 'none', sm: 'flex'}}}
                >
                  <HistoryPublicationButtons problems={problems} solutions={solutions} results={results} />
                </Stack>
              </Stack>
              <Stack
                direction="row-reverse"
                flexWrap="wrap"
                justifyContent="flex-start"
                alignItems="flex-end"
                gap={0.5}
                sx={{display: {xs: 'flex', sm: 'none'}}}
              >
                <Stack
                  direction="row"
                  flexWrap="nowrap"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  gap={0.5}
                  sx={{flexShrink: 0}}
                >
                  <HistoryPublicationButtons problems={problems} solutions={solutions} results={results} />
                </Stack>
                {event.galleries.map((gallery) => (
                  <Link variant="button2" key={gallery.id} href={gallery.gallery_link}>
                    {gallery.name}
                  </Link>
                ))}
              </Stack>
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="flex-end"
                alignItems="flex-end"
                gap={0.5}
                sx={{display: {xs: 'none', sm: 'flex'}, minHeight: '2rem'}}
              >
                {event.galleries.map((gallery) => (
                  <Link variant="button2" key={gallery.id} href={gallery.gallery_link}>
                    {gallery.name}
                  </Link>
                ))}
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

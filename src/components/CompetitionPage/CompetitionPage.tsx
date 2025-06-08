import {Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {useRouter} from 'next/router'
import {FC, Fragment} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Competition, Event, PublicationTypes} from '@/types/api/competition'

import {UpcomingOrCurrentEventInfo} from './UpcomingOrCurrentEventInfo'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
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
          `Tábor je určený pre ${who_can_participate}.`}
        {who_can_participate &&
          competition_type?.short_name === 'súťaž' &&
          `Súťaž je určená pre ${who_can_participate}.`}
        {who_can_participate &&
          competition_type?.short_name === 'seminár' &&
          `Seminár je určený pre ${who_can_participate}.`}
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

      <Grid container spacing={2}>
        {history_events.map((event) => {
          const results = event.publication_set.find((p) => p.publication_type === PublicationTypes.RESULTS.id)
          const solutions = event.publication_set.find((p) => p.publication_type === PublicationTypes.SOLUTIONS.id)
          const problems = event.publication_set.find((p) => p.publication_type === PublicationTypes.PROBLEMS.id)
          return (
            <Fragment key={event.id}>
              <Grid xs={8}>
                <Typography variant="h2" component="span">
                  {name} {event.school_year}
                </Typography>
              </Grid>
              <Grid xs={2} display="flex" justifyContent="end">
                {results && (
                  <Link variant="button2" key={results.id} href={results.file} target="_blank">
                    {PublicationTypes.RESULTS.display_name}
                  </Link>
                )}
              </Grid>
              <Grid xs={2} display="flex" justifyContent="end">
                {solutions ? (
                  <Link variant="button2" key={solutions.id} href={solutions.file} target="_blank">
                    {PublicationTypes.SOLUTIONS.display_name}
                  </Link>
                ) : (
                  problems && (
                    <Link variant="button2" key={problems.id} href={problems.file} target="_blank">
                      {PublicationTypes.PROBLEMS.display_name}
                    </Link>
                  )
                )}
              </Grid>
            </Fragment>
          )
        })}
      </Grid>
    </Stack>
  )
}

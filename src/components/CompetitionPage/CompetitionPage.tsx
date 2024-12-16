import {Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {useQuery} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {FC, Fragment, useEffect} from 'react'

import {apiAxios} from '@/api/apiAxios'
import {Link} from '@/components/Clickable/Link'
import {Competition, Event, PublicationTypes} from '@/types/api/competition'
import {BannerContainer} from '@/utils/BannerContainer'

import {UpcomingOrCurrentEventInfo} from './UpcomingOrCurrentEventInfo'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
}

export const CompetitionPage: FC<CompetitionPageProps> = ({
  competition: {
    id,
    competition_type,
    name,
    who_can_participate,
    description,
    upcoming_or_current_event,
    history_events,
    rules,
  },
}) => {
  const {setBannerMessages} = BannerContainer.useContainer()

  const {data: bannerMessage, isLoading: isBannerLoading} = useQuery({
    queryKey: ['cms', 'info-banner', 'competition', id],
    queryFn: () => apiAxios.get<string[]>(`/cms/info-banner/competition/${id}`),
    enabled: id !== -1,
  })

  const bannerMessages = bannerMessage?.data
  useEffect(() => {
    if (isBannerLoading || bannerMessages === undefined) setBannerMessages([])
    else setBannerMessages(bannerMessages)
  }, [setBannerMessages, isBannerLoading, bannerMessages])

  const router = useRouter()
  const rulesLink = `${router.asPath}/pravidla`

  return (
    <Stack gap={5}>
      <Typography variant="body1">
        {description}
        {who_can_participate && ` Súťaž je určená pre ${who_can_participate}.`}
      </Typography>

      {rules && (
        <Stack
          sx={{
            mt: 0.5,
            alignItems: 'end',
          }}
        >
          <Link variant="button2" href={rulesLink}>
            Pravidlá
          </Link>
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
                  <Link variant="button2" key={results.id} href={`/api${results.file}`} target="_blank">
                    {PublicationTypes.RESULTS.display_name}
                  </Link>
                )}
              </Grid>
              <Grid xs={2} display="flex" justifyContent="end">
                {solutions ? (
                  <Link variant="button2" key={solutions.id} href={`/api${solutions.file}`} target="_blank">
                    {PublicationTypes.SOLUTIONS.display_name}
                  </Link>
                ) : (
                  problems && (
                    <Link variant="button2" key={problems.id} href={`/api${problems.file}`} target="_blank">
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

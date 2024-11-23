import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Competition, Event} from '@/types/api/competition'
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
    queryFn: () => axios.get<string[]>(`/api/cms/info-banner/competition/${id}`),
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
      <Stack>
        <Typography variant="h2">Archív</Typography>

        <Stack gap={1}>
          {history_events.map((event) => (
            <Stack key={event.id} direction="row" sx={{justifyContent: 'space-between'}}>
              <Typography variant="h3" component="span">
                {name} {event.school_year}
              </Typography>
              <Stack direction="row" sx={{gap: {xs: 1, sm: 2}}}>
                {event.publication_set.map((publication) => (
                  <Link variant="button2" key={publication.id} href={`/api${publication.file}`}>
                    {publication.name}
                  </Link>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

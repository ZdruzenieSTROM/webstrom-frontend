import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Competition, Event} from '@/types/api/competition'
import {BannerContainer} from '@/utils/BannerContainer'
import {formatDateTime} from '@/utils/formatDate'

type OurCompetition = Omit<Competition, 'history_events'> & {history_events: Event[]}

type CompetitionPageProps = {
  competition: OurCompetition
}

export const CompetitionPage: FC<CompetitionPageProps> = ({
  competition: {
    id,
    name,
    who_can_participate,
    description,
    upcoming_or_current_event,
    competition_type,
    history_events,
  },
}) => {
  const {setBannerMessages} = BannerContainer.useContainer()

  const startDate = upcoming_or_current_event ? formatDateTime(upcoming_or_current_event.start) : null
  const endDate = upcoming_or_current_event ? formatDateTime(upcoming_or_current_event.end) : null

  const {data: bannerMessage, isLoading: isBannerLoading} = useQuery({
    queryKey: ['cms', 'info-banner', 'competition', id],
    queryFn: () => axios.get(`/api/cms/info-banner/competition/${id}`),
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
    <Stack gap={3}>
      {who_can_participate && <Typography variant="body1">Súťaž je určená pre {who_can_participate}</Typography>}

      {description && <Typography variant="body1">{description}</Typography>}

      <Stack alignSelf="center">
        <Link variant="button2" href={rulesLink}>
          Pravidlá
        </Link>
      </Stack>

      <Stack gap={2}>
        <Typography variant="h2">Nadchádzajúci ročník</Typography>
        {upcoming_or_current_event ? (
          <Stack gap={1}>
            {startDate && (
              <Typography variant="body1">
                <b>Od:</b> {startDate}
              </Typography>
            )}
            {endDate && (
              <Typography variant="body1">
                <b>Do:</b> {endDate}
              </Typography>
            )}
            {upcoming_or_current_event.publication_set.length > 0 && (
              <Stack alignSelf="center">
                <Link variant="button2" href={`/api/${upcoming_or_current_event.publication_set[0].file}`}>
                  Pozvánka
                </Link>
              </Stack>
            )}
            {upcoming_or_current_event.registration_link && (
              <>
                <Typography variant="body1">
                  <b>Registrácia prebieha do:</b> {formatDateTime(upcoming_or_current_event.registration_link.end)}
                </Typography>
                <Stack alignSelf="center">
                  <Link variant="button2" href={upcoming_or_current_event.registration_link.url}>
                    Registračný formulár
                  </Link>
                </Stack>
                <Typography variant="body1">{upcoming_or_current_event.registration_link.additional_info}</Typography>
              </>
            )}
          </Stack>
        ) : (
          <Typography variant="body1" sx={{marginTop: 1}}>
            Pripravujeme
          </Typography>
        )}
      </Stack>

      <Stack>
        <Typography variant="h2">Archív</Typography>
        {/* TODO: asi zjednotit styly, neriesit with/without publications */}
        {competition_type?.name === 'Tábor' ? (
          <Stack gap={1}>
            {history_events.map((event) => (
              <Typography key={event.id} variant="h3" component="span">
                {name + ' '} {event.school_year}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Stack gap={1}>
            {history_events.map((event) => (
              <Stack key={event.id} direction="row" gap={20}>
                <Typography variant="h3" component="span">
                  {name} {event.school_year}
                </Typography>
                <Stack direction="row" gap={2}>
                  {event.publication_set.map((publication) => (
                    <Link variant="button2" key={publication.id} href={`/api/${publication.file}`}>
                      {publication.name}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

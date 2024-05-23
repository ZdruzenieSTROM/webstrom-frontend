import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {DateTime} from 'luxon'
import {useRouter} from 'next/router'
import {FC, useEffect} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Competition, Event, RegistrationLink} from '@/types/api/competition'
import {BannerContainer} from '@/utils/BannerContainer'
import {formatDateTime, formatDateTimeInterval} from '@/utils/formatDate'

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

  const startDate = upcoming_or_current_event ? formatDateTime(upcoming_or_current_event.start) : null
  const endDate = upcoming_or_current_event ? formatDateTime(upcoming_or_current_event.end) : null

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

  const upcomingEventDate = upcoming_or_current_event
    ? formatDateTimeInterval(upcoming_or_current_event.start, upcoming_or_current_event.end)
    : null

  function getRegistrationInfo(registrationLink: RegistrationLink | null) {
    if (!registrationLink) return ``
    if (DateTime.fromISO(registrationLink.start) > DateTime.now())
      return `Registrácia bude otvorená od ${formatDateTime(registrationLink.start)}`
    else if (DateTime.fromISO(registrationLink.end) > DateTime.now())
      return `Registrácia je otvorená do ${formatDateTime(registrationLink.end)}`
    return `Registrácia bola ukončená`
  }

  function getEventInfo(upcomingEvent: Event | null) {
    if (competition_type?.short_name === 'súťaž')
      return `${upcomingEvent?.year}. ročník súťaže ${name} sa bude konať ${upcomingEventDate} ${
        upcomingEvent?.location || ''
      }. `
    else if (competition_type?.short_name === 'tábor')
      return `${name} v roku ${upcomingEvent?.school_year?.split('/')[1]} sa bude konať ${upcomingEventDate} ${
        upcomingEvent?.location || ''
      }.`
    else if (competition_type?.short_name === 'seminár')
      return `Aktuálne prebieha ${upcomingEvent?.year}. ročník seminára ${name}`
    return ''
  }

  const isRegistrationActive = upcoming_or_current_event?.registration_link
    ? DateTime.fromISO(upcoming_or_current_event.registration_link.start) < DateTime.now() &&
      DateTime.fromISO(upcoming_or_current_event.registration_link.end) > DateTime.now()
    : false

  return (
    <Stack gap={5}>
      <Typography variant="body1">
        {description && `${description}`}
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
          <Stack gap={1}>
            <Typography variant="body1">
              <b>
                {getEventInfo(upcoming_or_current_event)}
                {getRegistrationInfo(upcoming_or_current_event.registration_link)}
              </b>
            </Typography>
            <Stack sx={{alignItems: 'end'}}>
              {upcoming_or_current_event.publication_set.length > 0 && (
                <Link variant="button2" href={`/api/${upcoming_or_current_event.publication_set[0].file}`}>
                  Pozvánka
                </Link>
              )}
              {isRegistrationActive && (
                <Link variant="button2" href={upcoming_or_current_event.registration_link.url}>
                  Registrácia
                </Link>
              )}
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body1" sx={{marginTop: 1}}>
            Ďalší ročník aktuálne pripravujeme
          </Typography>
        )}
      </Stack>
      <Stack>
        <Typography variant="h2">Archív</Typography>
        {/* TODO: asi zjednotit styly, neriesit with/without publications */}

        <Stack gap={1}>
          {history_events.map((event) => (
            <Stack
              key={event.id}
              direction="row"
              sx={{
                justifyContent: 'space-between',
              }}
            >
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
      </Stack>
    </Stack>
  )
}

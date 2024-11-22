import {Stack, Typography} from '@mui/material'
import {DateTime} from 'luxon'
import {FC} from 'react'

import {Event} from '@/types/api/competition'
import {formatDateTime, formatDateTimeInterval} from '@/utils/formatDate'

import {Link} from '../Clickable/Link'

export const UpcomingOrCurrentEventInfo: FC<{event: Event; name: string; shortName: string | undefined}> = ({
  event,
  name,
  shortName,
}) => {
  const {year, school_year, location, registration_link, publication_set} = event

  const upcomingEventDate = event ? formatDateTimeInterval(event.start, event.end) : null

  const registrationInfo = (() => {
    if (DateTime.fromISO(registration_link.start) > DateTime.now())
      return `Registrácia bude otvorená od ${formatDateTime(registration_link.start)}`
    else if (DateTime.fromISO(registration_link.end) > DateTime.now())
      return `Registrácia je otvorená do ${formatDateTime(registration_link.end)}`
    return `Registrácia bola ukončená`
  })()

  const isRegistrationActive = registration_link
    ? DateTime.fromISO(registration_link.start) < DateTime.now() &&
      DateTime.fromISO(registration_link.end) > DateTime.now()
    : false

  return (
    <Stack gap={1}>
      <Typography variant="body1" fontWeight={800}>
        {shortName === 'súťaž' &&
          `${year}. ročník súťaže ${name} sa bude konať ${upcomingEventDate} ${location || ''}. `}
        {shortName === 'tábor' &&
          `${name} v roku ${school_year?.split('/')[1]} sa bude konať ${upcomingEventDate} ${location || ''}.`}
        {shortName === 'seminár' && `Aktuálne prebieha ${year}. ročník seminára ${name}`}
      </Typography>
      <Typography variant="body1" fontWeight={800}>
        {registrationInfo}
      </Typography>
      <Stack sx={{alignItems: 'end'}}>
        {publication_set.length > 0 && (
          <Link variant="button2" href={`/api/${publication_set[0].file}`}>
            Pozvánka
          </Link>
        )}
        {isRegistrationActive && (
          <Link variant="button2" href={registration_link.url}>
            Registrácia
          </Link>
        )}
      </Stack>
    </Stack>
  )
}

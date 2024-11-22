import {Stack, Typography} from '@mui/material'
import {DateTime} from 'luxon'
import {FC} from 'react'

import {Event} from '@/types/api/competition'
import {DateFormat, formatDateTimeInterval} from '@/utils/formatDate'

import {Link} from '../Clickable/Link'

export const UpcomingOrCurrentEventInfo: FC<{event: Event; name: string; shortName: string | undefined}> = ({
  event,
  name,
  shortName,
}) => {
  const {year, school_year, location, registration_link, publication_set, start, end} = event

  const upcomingEventDate = event ? formatDateTimeInterval(start, end) : null

  const regStart = DateTime.fromISO(registration_link.start)
  const regEnd = DateTime.fromISO(registration_link.end)
  const now = DateTime.now()

  const registrationInfo = (() => {
    if (now < regStart) return `Registrácia bude otvorená od ${regStart.toFormat(DateFormat.DATE_TIME)}`
    if (now < regEnd) return `Registrácia je otvorená do ${regEnd.toFormat(DateFormat.DATE_TIME)}`
    return `Registrácia bola ukončená`
  })()

  const isRegistrationActive = regStart < now && regEnd > now

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

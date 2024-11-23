import {Stack, Typography} from '@mui/material'
import {DateTime} from 'luxon'
import {FC} from 'react'

import {Event, PublicationTypes} from '@/types/api/competition'
import {DateFormat, formatDateTimeInterval} from '@/utils/formatDate'

import {Link} from '../Clickable/Link'

export const UpcomingOrCurrentEventInfo: FC<{event: Event; name: string; shortName: string | undefined}> = ({
  event,
  name,
  shortName,
}) => {
  const {year, school_year, location, registration_link, publication_set, start, end} = event

  const invitationFile = publication_set.find(
    (publication) => publication.publication_type === PublicationTypes.INVITATION.id,
  )

  const upcomingEventDate = event ? formatDateTimeInterval(start, end) : null

  const regStart = registration_link && DateTime.fromISO(registration_link.start)
  const regEnd = registration_link && DateTime.fromISO(registration_link.end)
  const now = DateTime.now()

  const registrationInfo = (() => {
    if (!regStart || !regEnd) return ''
    if (now < regStart) return `Registrácia bude otvorená od ${regStart.toFormat(DateFormat.DATE_TIME)}`
    if (now < regEnd) return `Registrácia je otvorená do ${regEnd.toFormat(DateFormat.DATE_TIME)}`
    return `Registrácia bola ukončená`
  })()

  const isRegistrationActive = regStart && regEnd && regStart < now && regEnd > now

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
      <Stack direction="row" sx={{justifyContent: 'end', gap: {xs: 1, sm: 2}}}>
        {invitationFile && (
          <Link variant="button2" href={`/api/${invitationFile.name}`}>
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

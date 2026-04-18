import {Box, Stack} from '@mui/material'
import {FC} from 'react'

import {Link} from '@/components/Clickable/Link'
import {Markdown} from '@/components/Markdown/Markdown'

const CALENDAR_ID = 'c_c12a88ba51a7b22813315d28200c49f62f8e37fd3e17ac31bc271b084192a9af@group.calendar.google.com'

const embedSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
  CALENDAR_ID,
)}&ctz=Europe%2FBratislava&hl=sk&showTitle=0&showPrint=0&showCalendars=0&showTabs=1&color=%23000000`

const subscribeSrc = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(CALENDAR_ID)}`

export const Calendar: FC = () => (
  <Stack gap={2}>
    <Markdown content="V kalendári nájdeš všetky akcie, ktoré máme zatiaľ naplánované. Dátumy sa občas môžu meniť, tak ho priebežne sleduj alebo si ho pridaj do svojho Google Kalendára." />
    <Box
      component="iframe"
      src={embedSrc}
      title="Kalendár akcií"
      sx={{
        width: '100%',
        height: {xs: 400, md: 700},
        border: 0,
      }}
    />
    <Link href={subscribeSrc} sx={{alignSelf: 'flex-start'}}>
      Pridať kalendár do Google Kalendára
    </Link>
  </Stack>
)

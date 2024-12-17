import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC, useState} from 'react'

import {apiAxios} from '@/api/apiAxios'
import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {PasswordChangeDialog} from './PasswordChangeForm'

type ProfileLineInput = {
  label: string
  value?: string
}

const ProfileLine: FC<ProfileLineInput> = ({label, value}) => {
  return (
    <Stack direction={'row'} gap={1}>
      <Typography variant="h2" component="span">
        {label}
      </Typography>
      <Typography variant="h2" fontStyle="normal" fontWeight="400" textTransform="none" component="span">
        {value}
      </Typography>
    </Stack>
  )
}

export const ProfileDetail: FC = () => {
  const {isAuthed} = AuthContainer.useContainer()
  const {seminar} = useSeminarInfo()

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  const toggleOpenPasswordDialog = () => {
    setOpenPasswordDialog((prev) => !prev)
  }

  const {data} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => apiAxios.get<Profile>(`/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const profile = data?.data

  return (
    <Stack>
      <Stack gap={4}>
        <ProfileLine label={'meno'} value={profile?.first_name || '-'} />
        <ProfileLine label={'priezvisko'} value={profile?.last_name || '-'} />
        <ProfileLine label={'e-mail'} value={profile?.email || '-'} />
        <ProfileLine label={'škola'} value={profile?.school.verbose_name || '-'} />
        <ProfileLine label={'ročník'} value={profile?.grade_name || '-'} />
        <ProfileLine label={'tel. č.'} value={profile?.phone || '-'} />
        <ProfileLine label={'tel. č. na rodiča'} value={profile?.parent_phone || '-'} />
      </Stack>
      <Stack direction="row" justifyContent="flex-end" mt={3} gap={4}>
        <Link variant="button2" href={`/${seminar}/profil/uprava`}>
          Upraviť údaje
        </Link>
        <Button variant="button2" onClick={toggleOpenPasswordDialog}>
          Zmeniť heslo
        </Button>
      </Stack>
      <PasswordChangeDialog open={openPasswordDialog} close={toggleOpenPasswordDialog} />
    </Stack>
  )
}

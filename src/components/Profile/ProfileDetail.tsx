import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useState} from 'react'

import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Button, Link} from '../Clickable/Clickable'
import {PasswordChangeDialog} from './PasswordChangeForm'

type ProfileLineInput = {
  label: string
  value?: string
}

const ProfileLine: FC<ProfileLineInput> = ({label, value}) => {
  return (
    <Stack direction={'row'} spacing={1}>
      <Typography variant="h2">{label}</Typography>
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
    queryFn: () => axios.get<Profile>(`/api/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const profile = data?.data

  return (
    <Stack>
      <Stack spacing={2}>
        <ProfileLine label={'meno'} value={profile?.first_name + ' ' + profile?.last_name} />
        <ProfileLine label={'e-mail'} value={profile?.email} />
        <ProfileLine label={'škola'} value={profile?.school.verbose_name} />
        <ProfileLine label={'ročník'} value={profile?.grade_name} />
        <ProfileLine label={'tel. č.'} value={profile?.phone || '-'} />
        <ProfileLine label={'tel. č. na rodiča'} value={profile?.parent_phone || '-'} />
      </Stack>
      <Stack direction={'row'} mt={3} spacing={2}>
        <Link href={`/${seminar}/profil/uprava`}>
          <Typography variant="button2">Upraviť údaje</Typography>
        </Link>
        <Button onClick={toggleOpenPasswordDialog}>
          <Typography variant="button2">Zmeniť heslo</Typography>
        </Button>
      </Stack>
      <PasswordChangeDialog open={openPasswordDialog} close={toggleOpenPasswordDialog} />
    </Stack>
  )
}

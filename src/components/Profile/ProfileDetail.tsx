import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useState} from 'react'

import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Button, Link} from '../Clickable/Clickable'
import {PasswordChangeDialog} from './PasswordChangeForm'
import styles from './ProfileDetail.module.scss'

type ProfileLineInput = {
  label: string
  value?: string
}

const ProfileLine: FC<ProfileLineInput> = ({label, value}) => {
  return (
    // font-size: 30px podla designu
    <Typography sx={{fontSize: '1.875rem'}}>
      <span className={styles.label}>{label}</span>
      {value}
    </Typography>
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
        <Link href={`/${seminar}/profil/uprava`}>Upraviť údaje</Link>
        <Button onClick={toggleOpenPasswordDialog}>Zmeniť heslo</Button>
      </Stack>
      <PasswordChangeDialog open={openPasswordDialog} close={toggleOpenPasswordDialog} />
    </Stack>
  )
}

import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'

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

  const {data} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => axios.get<Profile>(`/api/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const profile = data?.data

  return (
    <Stack spacing={2}>
      <ProfileLine label={'meno'} value={profile?.first_name + ' ' + profile?.last_name} />
      {/* TODO: pockat na BE kym to posle v datach */}
      <ProfileLine label={'e-mail'} value={'TODO'} />
      <ProfileLine label={'škola'} value={profile?.school.verbose_name} />
      {/* TODO: pockat na BE kym to posle v datach */}
      <ProfileLine label={'ročník'} value={`${profile?.grade}`} />
      <ProfileLine label={'tel. č.'} value={profile?.phone || '-'} />
      <ProfileLine label={'tel. č. na rodiča'} value={profile?.parent_phone || '-'} />
    </Stack>
  )
}

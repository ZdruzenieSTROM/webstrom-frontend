import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Button, Link} from '../Clickable/Clickable'
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
        <Link href={`/${seminar}/profil/uprava`}>upraviť údaje</Link>
        <Button
          onClick={() => {
            console.log('TODO: modal so zmenou hesla')
          }}
        >
          zmeniť heslo
        </Button>
      </Stack>
    </Stack>
  )
}
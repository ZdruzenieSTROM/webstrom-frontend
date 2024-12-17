import {Stack, Typography} from '@mui/material'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {useProfile} from '@/utils/useProfile'
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
  const {seminar} = useSeminarInfo()

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)

  const toggleOpenPasswordDialog = () => {
    setOpenPasswordDialog((prev) => !prev)
  }

  const {profile} = useProfile()

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

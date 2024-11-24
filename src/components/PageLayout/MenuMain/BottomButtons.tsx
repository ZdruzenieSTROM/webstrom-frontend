import {Box, Stack} from '@mui/material'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dialog} from '../../Dialog/Dialog'
import {LoginForm} from '../LoginForm/LoginForm'

export const BottomButtons: FC = () => {
  const [displayAuthenticationDialog, setDisplayAuthenticationDialog] = useState(false)
  const {logout, isAuthed} = AuthContainer.useContainer()

  const toggleDisplayAuthenticationDialog = () => {
    setDisplayAuthenticationDialog((prev) => !prev)
  }

  const {seminar} = useSeminarInfo()

  const router = useRouter()

  const redirectLogout = () => {
    logout()
    if (router.asPath.endsWith('profil') || router.asPath.endsWith('profil/uprava')) {
      router.push(`/${seminar}`)
    }
  }

  const separator = <Box sx={{borderLeft: '2px solid white'}} />

  return (
    <Stack direction="row" sx={{mt: '1rem', justifyContent: 'center', gap: '10px'}}>
      {!isAuthed ? (
        <>
          <Link invertColors variant="button2" href={`/${seminar}/registracia`}>
            Registrovať
          </Link>
          {separator}
          <Button invertColors variant="button2" onClick={toggleDisplayAuthenticationDialog}>
            Prihlásiť
          </Button>
        </>
      ) : (
        <>
          <Link invertColors variant="button2" href={`/${seminar}/profil`}>
            Profil
          </Link>
          {separator}
          <Button invertColors variant="button2" onClick={redirectLogout}>
            Odhlásiť
          </Button>
        </>
      )}
      <Dialog open={displayAuthenticationDialog} close={toggleDisplayAuthenticationDialog} title="Prihlásenie">
        <LoginForm closeDialog={toggleDisplayAuthenticationDialog} />
      </Dialog>
    </Stack>
  )
}

import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dialog} from '../../Dialog/Dialog'
import {LoginFormWrapper} from '../LoginFormWrapper/LoginFormWrapper'
import styles from './Authentication.module.scss'

export const Authentication: FC = () => {
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
      router.push('/')
    }
  }

  if (!isAuthed) {
    return (
      <>
        <div className={styles.authenticationDisplayButtons}>
          <Link href={`/${seminar}/registracia`}>Registrovať</Link>
          <span onClick={toggleDisplayAuthenticationDialog}>Prihlásiť</span>
        </div>
        <Dialog open={displayAuthenticationDialog} close={toggleDisplayAuthenticationDialog} title="Prihlásenie">
          <LoginFormWrapper closeDialog={toggleDisplayAuthenticationDialog} />
        </Dialog>
      </>
    )
  } else {
    return (
      <div className={styles.authenticationDisplayButtons}>
        <Link href={`/${seminar}/profil`}>Profil</Link>
        <span onClick={redirectLogout}>Odhlásiť</span>
      </div>
    )
  }
}

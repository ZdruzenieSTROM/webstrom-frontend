import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Overlay} from '../../Overlay/Overlay'
import {LoginFormWrapper} from '../LoginFormWrapper/LoginFormWrapper'
import styles from './Authentication.module.scss'

export const Authentication: FC = () => {
  const [displayAuthenticationOverlay, setDisplayAuthenticationOverlay] = useState(false)
  const {logout, isAuthed} = AuthContainer.useContainer()

  const toggleDisplayLoginOverlay = () => {
    setDisplayAuthenticationOverlay((prev) => !prev)
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
          <span onClick={toggleDisplayLoginOverlay}>Prihlásiť</span>
        </div>
        <Overlay display={displayAuthenticationOverlay} closeOverlay={toggleDisplayLoginOverlay}>
          <div className={styles.authenticationContainer}>
            <div className={styles.content}>
              <LoginFormWrapper closeOverlay={toggleDisplayLoginOverlay} />
            </div>
          </div>
        </Overlay>
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

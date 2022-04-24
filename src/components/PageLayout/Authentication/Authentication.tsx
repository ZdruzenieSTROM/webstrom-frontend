import Link from 'next/link'
import {FC, useState} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Overlay} from '../../Overlay/Overlay'
import {LoginForm} from '../LoginForm/LoginForm'
import styles from './Authentication.module.scss'

export const Authentication: FC = () => {
  const [displayAuthenticationOverlay, setDisplayAuthenticationOverlay] = useState(false)
  const {logout, isAuthed} = AuthContainer.useContainer()

  const toggleDisplayAuthenticationOverlay = () => {
    setDisplayAuthenticationOverlay((prevDisplay) => {
      if (!prevDisplay) {
        // Ak sa má zobraziť overlay s login formom, input s emailom sa automaticky focusne.
        const email = document.getElementById('login-email') as HTMLInputElement
        email.focus()
      }
      return !prevDisplay
    })
  }

  const closeAuthenticationOverlay = () => {
    setDisplayAuthenticationOverlay(false)
  }

  const displayLoginForm = () => {
    setDisplayAuthenticationOverlay(true)
  }
  const {seminar} = useSeminarInfo()

  if (!isAuthed) {
    return (
      <>
        <div className={styles.authenticationDisplayButtons}>
          <Link href={`/${seminar}/registracia`}>
            <a>
              <span>Registrovať</span>
            </a>
          </Link>
          <span onClick={displayLoginForm}>Prihlásiť</span>
        </div>
        <Overlay display={displayAuthenticationOverlay} closeOverlay={closeAuthenticationOverlay}>
          <div className={styles.authenticationContainer}>
            <div className={styles.content}>
              <LoginForm closeOverlay={toggleDisplayAuthenticationOverlay} />
            </div>
          </div>
        </Overlay>
      </>
    )
  } else {
    return (
      <div className={styles.authenticationDisplayButtons}>
        <span onClick={logout}>Odhlásiť</span>
      </div>
    )
  }
}

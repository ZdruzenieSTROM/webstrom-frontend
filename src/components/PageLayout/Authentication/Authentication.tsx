import Link from 'next/link'
import {FC, useState} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Overlay} from '../../Overlay/Overlay'
import {LoginForm} from '../LoginForm/LoginForm'
import styles from './Authentication.module.scss'

export const Authentication: FC = () => {
  const [displayAuthenticationOverlay, setDisplayAuthenticationOverlay] = useState(false)
  const [displayLogin, setDisplayLogin] = useState(true) // true -> zobrazí sa login, false -> zobrazí sa registrácia
  const {logout, user} = AuthContainer.useContainer()

  const toggleDisplayAuthenticationOverlay = () => {
    setDisplayAuthenticationOverlay((prevDisplay) => {
      if (!prevDisplay && displayLogin) {
        // Ak sa má zobraziť overlay s login formom, inpput s emailom sa automaticky focusne.
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
    setDisplayLogin(true)
  }

  const displayRegistrationForm = () => {
    setDisplayAuthenticationOverlay(true)
    setDisplayLogin(false)
  }

  const {seminar} = useSeminarInfo()

  if (!user.online) {
    return (
      <>
        <div className={styles.authenticationDisplayButtons}>
          <span onClick={displayRegistrationForm}>Registrovať</span>
          <span onClick={displayLoginForm}>Prihlásiť</span>
        </div>
        <Overlay display={displayAuthenticationOverlay} closeOverlay={closeAuthenticationOverlay}>
          <div className={styles.authenticationContainer}>
            <div className={styles.tabs}>
              <div
                className={displayLogin ? styles.active : ''}
                onClick={() => {
                  setDisplayLogin(true)
                }}
              >
                <span className={styles.underline}>Prihlásiť sa</span>
              </div>
              <div
                className={!displayLogin ? styles.active : ''}
                onClick={() => {
                  setDisplayLogin(false)
                }}
              >
                <span className={styles.underline}>Registrovať</span>
              </div>
            </div>
            <div className={styles.content}>
              {displayLogin ? (
                <LoginForm closeOverlay={toggleDisplayAuthenticationOverlay} />
              ) : (
                // Tu by mal byť registračný form od Matúša
                <Link href={`/${seminar}/registracia`}>
                  <a>Registrácia</a>
                </Link>
              )}
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

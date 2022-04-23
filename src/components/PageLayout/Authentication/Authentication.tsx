import axios, {AxiosError} from 'axios'
import {FC, useState} from 'react'
import {useCookies} from 'react-cookie'

import {UserContainer} from '@/utils/UserContainer'
import {WebstromTokenContainer} from '@/utils/WebstromTokenContainer'

import {Overlay} from '../../Overlay/Overlay'
import {LoginForm} from '../LoginForm/LoginForm'
import styles from './Authentication.module.scss'

export const Authentication: FC = () => {
  const [displayAuthenticationOverlay, setDisplayAuthenticationOverlay] = useState(false)
  const [displayLogin, setDisplayLogin] = useState(true) // true -> zobrazí sa login, false -> zobrazí sa registrácia
  const [, , removeCookie] = useCookies(['webstrom-token']) // ToDo: remove
  const {user} = UserContainer.useContainer()
  const {setWebstromToken} = WebstromTokenContainer.useContainer()

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

  const handleLogout = async () => {
    // Funkcia ktorá zavolá logout api point ktorý zmaže token na BE a odstráni cookies s tokenom a menom.
    try {
      await axios.post('/api/user/logout/', {})
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      // console.log(error)
    }
    removeCookie('webstrom-token', {path: '/'})
    setWebstromToken('')
  }

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
                '<RegistrationForm />' // Tu by mal byť registračný form od Matúša
              )}
            </div>
          </div>
        </Overlay>
      </>
    )
  } else {
    return (
      <div className={styles.authenticationDisplayButtons}>
        <span onClick={handleLogout}>Odhlásiť</span>
      </div>
    )
  }
}

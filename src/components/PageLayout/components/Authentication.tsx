// import './Authentication.scss'
import axios, {AxiosError} from 'axios'
import React, {useState} from 'react'
import {useCookies} from 'react-cookie'

import {Overlay} from '../../Overlay/Overlay'
import {LoginForm} from './LoginForm'

export const Authentication: React.FC = () => {
  const [displayAuthenticationOverlay, setDisplayAuthenticationOverlay] = useState(false)
  const [displayLogin, setDisplayLogin] = useState(true) // true -> zobrazí sa login, false -> zobrazí sa registrácia
  const [cookies, setCookie, removeCookie] = useCookies(['webstrom-token'])

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

  const toggleDisplayLogin = () => {
    setDisplayLogin((prevDisplay) => !prevDisplay)
  }

  const displayLoginForm = () => {
    setDisplayAuthenticationOverlay(true)
    setDisplayLogin(true)
  }

  const displayRegistrationForm = () => {
    setDisplayAuthenticationOverlay(true)
    setDisplayLogin(false)
  }

  const addRandomCookie = () => {
    // Testovacia funkcia ktorá nastaví webstrom-token na náhodný string
    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1)
    setCookie('webstrom-token', 'fawefew', {path: '/', expires: expirationDate})
  }

  const handleLogout = async () => {
    // Funkcia ktorá zavolá logout api point ktorý zmaže token na BE a odstráni cookies s tokenom a menom.
    try {
      await axios.post('/api/user/logout/', {})
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      console.log(error)
    }
    removeCookie('webstrom-token', {path: '/'})
    removeCookie('webstrom-name', {path: '/'})
  }

  // Ak neexistuje webstrom-token cookies ponúkne sa možnosť na prihlásenie alebo registráciu.
  // Ak tento token existuje, užívateľ je prihlásený a dostane možnosť odhlásiť sa.
  if (cookies['webstrom-token'] === undefined) {
    return (
      <>
        <div id="authentication-display-buttons">
          <span onClick={displayRegistrationForm}>Registrovať</span>
          <span onClick={displayLoginForm}>Prihlásiť</span>
          {/* Testovací "Cookie" button, ktorý nasvaví webstrom-token na nezmyselný string */}
          <span onClick={addRandomCookie}>Cookie</span>
        </div>
        <Overlay display={displayAuthenticationOverlay} closeOverlay={closeAuthenticationOverlay}>
          <div id="authentication-container">
            <div className="tabs">
              <div
                className={displayLogin ? 'active' : ''}
                onClick={() => {
                  setDisplayLogin(true)
                }}
              >
                <span className="underline">Prihlásiť sa</span>
              </div>
              <div
                className={!displayLogin ? 'active' : ''}
                onClick={() => {
                  setDisplayLogin(false)
                }}
              >
                <span className="underline">Registrovať</span>
              </div>
            </div>
            <div className="content">
              {displayLogin ? (
                <LoginForm
                  closeOverlay={toggleDisplayAuthenticationOverlay}
                  loginRegistrationToggle={toggleDisplayLogin}
                />
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
      <div id="authentication-display-buttons">
        <span onClick={handleLogout}>Odhlásiť</span>
      </div>
    )
  }
}

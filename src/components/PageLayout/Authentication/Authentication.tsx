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

  const toggleDisplayLoginOverlay = () => {
    setDisplayAuthenticationOverlay((prev) => !prev)
  }

  const {seminar} = useSeminarInfo()

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
              <LoginForm closeOverlay={toggleDisplayLoginOverlay} />
            </div>
          </div>
        </Overlay>
      </>
    )
  } else {
    return (
      <div className={styles.authenticationDisplayButtons}>
        <span onClick={() => logout()}>Odhlásiť</span>
      </div>
    )
  }
}

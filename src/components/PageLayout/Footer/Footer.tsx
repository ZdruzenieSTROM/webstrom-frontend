import {FC} from 'react'
import {useCookies} from 'react-cookie'

import {useUser, useWebstromToken} from '@/utils/UserContext'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const user = useUser()
  // const [cookies] = useCookies('webstrom-token')
  const webstromToken = useWebstromToken()
  return (
    <div className={styles.footer}>
      <div>
        <span>Temp debug info: </span>
        <span> user-name: {user.first_name + ' ' + user.last_name} </span>
        <span> user.online: {user.online ? 'true' : 'false'} </span>
        <span>cookies: {webstromToken}</span>
      </div>
    </div>
  )
}

import {FC} from 'react'

import {UserContainer} from '@/utils/UserContainer'
import {WebstromTokenContainer} from '@/utils/WebstromTokenContainer'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const {user} = UserContainer.useContainer()
  const {webstromToken} = WebstromTokenContainer.useContainer()
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

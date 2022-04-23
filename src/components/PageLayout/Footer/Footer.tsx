import {FC} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const {isAuthed, user} = AuthContainer.useContainer()
  return (
    <div className={styles.footer}>
      <div>
        <span>Temp debug info: </span>
        <span> user-name: {user.first_name + ' ' + user.last_name} </span>
        <span> user.online: {`${user.online}`} </span>
        <span>isAuthed: {`${isAuthed}`}</span>
      </div>
    </div>
  )
}

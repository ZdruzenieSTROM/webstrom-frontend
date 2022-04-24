import {FC} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'
import {ProfileContainer} from '@/utils/ProfileContainer'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const {profile} = ProfileContainer.useContainer()
  const {isAuthed} = AuthContainer.useContainer()

  return (
    <div className={styles.footer}>
      <div>
        <span>Debug info: </span>
        <span>user name: {profile?.first_name + ' ' + profile?.last_name} </span>
        <span>profile loaded: {`${!!profile}`} </span>
        <span>isAuthed: {`${isAuthed}`}</span>
      </div>
    </div>
  )
}

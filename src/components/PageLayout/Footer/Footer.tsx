import {FC} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const {isAuthed, profile} = AuthContainer.useContainer()
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

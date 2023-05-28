import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const {isAuthed} = AuthContainer.useContainer()

  const {data} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => axios.get<Profile>(`/api/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const profile = data?.data

  return (
    <div className={styles.footer}>
      <span>Debug info: </span>
      <span>user name: {profile?.first_name + ' ' + profile?.last_name} </span>
      <span>isAuthed: {`${isAuthed}`}</span>
    </div>
  )
}

import {FC} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Link} from '../Clickable/Clickable'
import styles from './Post.module.scss'

export interface IPost {
  id: number
  links: {id: number; caption: string; url: string}[]
  caption: string
  short_text: string
  details: string
  added_at: string
  visible_after: string
  visible_until: string
  sites: number[]
}

export const Post: FC<IPost> = ({id, caption, short_text, links, sites}) => {
  const {seminarId} = useSeminarInfo()

  if (!sites.includes(seminarId)) return null

  return (
    <li key={id}>
      <h2 className={styles.title}>{caption}</h2>
      <p className={styles.text}>{short_text}</p>
      <div className={styles.links}>
        {links.map(({id, url, caption}) => (
          <p key={id}>
            <Link href={url}>{caption}</Link>
          </p>
        ))}
      </div>
    </li>
  )
}

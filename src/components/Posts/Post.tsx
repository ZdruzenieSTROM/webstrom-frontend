import {FC} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Link} from '../Clickable/Clickable'

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
      <h2>{caption}</h2>
      <h3>{short_text}</h3>
      {links.map(({id, url, caption}) => (
        <p key={id}>
          <h3>
            <Link href={url}>{caption}</Link>
          </h3>
        </p>
      ))}
      <h5>PODROBNOSTI</h5>
    </li>
  )
}

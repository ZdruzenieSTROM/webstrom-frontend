import {Stack, Typography} from '@mui/material'
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
      <Typography variant="h2" textTransform="none" fontStyle="normal">
        {caption}
      </Typography>
      <Typography variant="h2" component="p" textTransform="none" fontStyle="normal" fontWeight={400}>
        {short_text}
      </Typography>
      {/* alignItems so the links don't stretch */}
      <Stack gap={0.5} alignItems="start">
        {links.map(({id, url, caption}) => (
          <Link key={id} href={url}>
            {caption}
          </Link>
        ))}
      </Stack>
    </li>
  )
}

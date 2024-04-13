import {Stack, Typography} from '@mui/material'
import {FC} from 'react'

import {formatDate} from '@/utils/formatDate'

import {Button} from '../Clickable/Button'
import {Link} from '../Clickable/Link'

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
  openDetail: () => void
}


export const Post: FC<IPost> = ({caption, short_text, links, details, added_at, openDetail}) => (
  <Stack>
    <Typography variant="postTitle">{caption}</Typography>

    <Typography variant="postBody">{short_text}</Typography>

    <Stack direction="row" justifyContent="space-between" gap={0.5}>
      {/* alignItems so the links don't stretch */}
      <Stack gap={0.5} alignItems="start">
        {details.length > 0 && (
          <Button type="button" onClick={openDetail} variant="button2">
            Podrobnosti
          </Button>
        )}
        {links.map(({id, url, caption}) => (
          <Link key={id} href={url} variant="button2">
            {caption}
          </Link>
        ))}
      </Stack>
      <Typography variant="body1" fontWeight={275} textTransform="uppercase">
        {formatDate(added_at)}
      </Typography>
    </Stack>
  </Stack>
)

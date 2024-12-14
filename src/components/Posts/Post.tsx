import {Stack, Typography} from '@mui/material'
import {FC, useState} from 'react'

import {formatDate} from '@/utils/formatDate'

import {Button} from '../Clickable/Button'
import {Link} from '../Clickable/Link'
import {PostMarkdown} from './PostMarkdown'

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

export const Post: FC<IPost> = ({caption, short_text, links, details, added_at}) => {
  const [displayDetail, setDisplayDetail] = useState<boolean>(false)
  const toggleDisplayDetail = () => setDisplayDetail((prev) => !prev)

  return (
    <Stack gap={0.5}>
      <Typography variant="postTitle">{caption}</Typography>

      <Typography variant="postBody">{short_text}</Typography>

      {displayDetail && <PostMarkdown content={details} />}

      <Stack direction="row" justifyContent="space-between" gap={0.5} mt={0.5}>
        {/* alignItems so the links don't stretch */}
        <Stack gap={0.5} alignItems="start" ml="-10px">
          {details.length > 0 && (
            <Button type="button" onClick={toggleDisplayDetail} variant="button2">
              {displayDetail ? 'Zobraziť menej' : 'Zobraziť viac'}
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
}

import {Stack, Typography} from '@mui/material'
import {FC} from 'react'

import {PostMarkdown} from './PostMarkdown'

export interface IPost {
  caption: string
  details: string
}

export const PostDetail: FC<IPost> = ({caption, details}) => {
  return (
    <Stack
      p={2}
      sx={{
        border: '1rem solid black',
        backgroundColor: 'white',
        maxHeight: '60vh',
        overflow: 'scroll',
      }}
    >
      <Typography variant="postTitle" textTransform="uppercase" fontStyle="italic" mb={4}>
        {caption}
      </Typography>
      <PostMarkdown content={details} />
    </Stack>
  )
}

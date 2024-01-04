import {Stack, Typography} from '@mui/material'
import {FC} from 'react'

import {PostMarkdown} from './PostMarkdown'

type PostDetailProps = {
  caption: string
  details: string
}

export const PostDetail: FC<PostDetailProps> = ({caption, details}) => {
  return (
    <Stack
      p={2}
      sx={{
        border: '1rem solid black',
        backgroundColor: 'white',
        maxHeight: '60vh',
        overflow: 'auto',
      }}
    >
      <Typography variant="postTitle" textTransform="uppercase" fontStyle="italic" mb={4}>
        {caption}
      </Typography>
      <PostMarkdown content={details} />
    </Stack>
  )
}

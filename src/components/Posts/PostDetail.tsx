import {Box, Stack, Typography} from '@mui/material'
import {FC} from 'react'

import {CloseButton} from '../CloseButton/CloseButton'
import {PostMarkdown} from './PostMarkdown'

type PostDetailProps = {
  caption: string
  details: string
  closeDetail: () => void
}

export const PostDetail: FC<PostDetailProps> = ({caption, details, closeDetail: closeDetail}) => {
  return (
    <Stack
      p={2}
      sx={{
        border: '1rem solid black',
        backgroundColor: 'white',
        maxHeight: '60vh',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <Box position="absolute" top={16} right={16}>
        <CloseButton size={30} onClick={closeDetail} invertColors />
      </Box>
      <Typography variant="postTitle" textTransform="uppercase" fontStyle="italic" mb={4}>
        {caption}
      </Typography>
      <PostMarkdown content={details} />
    </Stack>
  )
}

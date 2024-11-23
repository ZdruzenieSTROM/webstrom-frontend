import {Box, Stack, Theme, Typography, useMediaQuery} from '@mui/material'
import {FC} from 'react'

import {CloseButton} from '../CloseButton/CloseButton'
import {PostMarkdown} from './PostMarkdown'

type PostDetailProps = {
  caption: string
  details: string
  closeDetail: () => void
}

export const PostDetail: FC<PostDetailProps> = ({caption, details, closeDetail}) => {
  const lg = useMediaQuery<Theme>((theme) => theme.breakpoints.up('lg'))
  const iconSize = lg ? 34 : 24

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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="postTitle" textTransform="uppercase" fontStyle="italic">
          {caption}
        </Typography>
        <CloseButton size={iconSize} onClick={closeDetail} invertColors />
      </Stack>
      <PostMarkdown content={details} />
    </Stack>
  )
}

import {Grid, Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useState} from 'react'

import {Loading} from '../Loading/Loading'
import {IPost, Post} from './Post'
import {PostDetail} from './PostDetail'

export const Posts: FC = () => {
  const {
    data: postsData,
    isLoading: postsIsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ['cms', 'post', 'visible'],
    queryFn: () => axios.get<IPost[]>('/api/cms/post/visible'),
  })
  const posts = postsData?.data ?? []

  const [activePostDetailIndex, setActivePostDetailIndex] = useState<number | undefined>(undefined)

  if (postsIsLoading) return <Loading />

  if (postsError) return <Typography>{postsError.message}</Typography>

  return (
    <>
      {activePostDetailIndex !== 0 && (
        <Grid display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={5} mb={5}>
          <Stack gap={5} gridColumn="span 4">
            {posts.slice(0, activePostDetailIndex).map((post, index) => (
              <Post key={post.id} {...post} openDetail={() => setActivePostDetailIndex(index)} />
            ))}
          </Stack>
        </Grid>
      )}
      {activePostDetailIndex !== undefined && (
        <Grid display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={5}>
          <Stack gap={5} gridColumn="span 4">
            {posts.slice(activePostDetailIndex).map((post, index) => (
              <Post
                key={post.id}
                {...post}
                openDetail={() => setActivePostDetailIndex(activePostDetailIndex + index)}
              />
            ))}
          </Stack>
          <Stack gridColumn="span 5">
            <PostDetail caption={posts[activePostDetailIndex].caption} details={posts[activePostDetailIndex].details} />
          </Stack>
        </Grid>
      )}
    </>
  )
}

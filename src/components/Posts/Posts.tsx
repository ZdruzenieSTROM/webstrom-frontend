import {Stack, Typography} from '@mui/material'
// new MUI Grid without spacing issues: https://mui.com/material-ui/react-grid2/
import Grid from '@mui/material/Unstable_Grid2'
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
        <Grid container columnSpacing={5} mb={5}>
          <Grid xs={4}>
            <Stack gap={5}>
              {posts.slice(0, activePostDetailIndex).map((post, index) => (
                <Post key={post.id} {...post} openDetail={() => setActivePostDetailIndex(index)} />
              ))}
            </Stack>
          </Grid>
        </Grid>
      )}
      {activePostDetailIndex !== undefined && (
        <Grid container columnSpacing={5}>
          <Grid xs={4}>
            <Stack gap={5}>
              {posts.slice(activePostDetailIndex).map((post, index) => (
                <Post
                  key={post.id}
                  {...post}
                  openDetail={() => setActivePostDetailIndex(activePostDetailIndex + index)}
                />
              ))}
            </Stack>
          </Grid>
          <Grid xs={5}>
            <PostDetail caption={posts[activePostDetailIndex].caption} details={posts[activePostDetailIndex].details} />
          </Grid>
        </Grid>
      )}
    </>
  )
}

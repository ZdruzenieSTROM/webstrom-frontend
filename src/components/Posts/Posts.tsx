import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useState} from 'react'

import {Loading} from '../Loading/Loading'
import {IPost, Post} from './Post'

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

  const [activePostDetailId, setActivePostDetailId] = useState<number | null>(null)

  if (postsIsLoading) return <Loading />

  if (postsError) return <Typography>{postsError.message}</Typography>

  return (
    <Stack gap={5} mb={10}>
      {posts.map((post) => (
        <Post
          key={post.id}
          {...post}
          isDetailOpen={post.id === activePostDetailId}
          openDetail={() => setActivePostDetailId(post.id)}
        />
      ))}
    </Stack>
  )
}

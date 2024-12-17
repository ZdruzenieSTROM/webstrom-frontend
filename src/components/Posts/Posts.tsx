import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiAxios} from '@/api/apiAxios'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Loading} from '../Loading/Loading'
import {IPost, Post} from './Post'

export const Posts: FC = () => {
  const {
    data: postsData,
    isLoading: postsIsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ['cms', 'post', 'visible'],
    queryFn: () => apiAxios.get<IPost[]>(`/cms/post/visible?sites=${seminarId}`),
  })
  const posts = postsData?.data ?? []

  const {seminarId} = useSeminarInfo()

  if (postsIsLoading) return <Loading />

  if (postsError) return <Typography>{postsError.message}</Typography>

  return (
    <Stack gap={5}>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Stack>
  )
}

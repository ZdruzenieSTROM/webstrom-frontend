import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiOptions} from '@/api/api'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Loading} from '../Loading/Loading'
import {Post} from './Post'

export const Posts: FC = () => {
  const {seminarId} = useSeminarInfo()

  const {
    data: postsData,
    isLoading: postsIsLoading,
    error: postsError,
  } = useQuery(apiOptions.cms.post.visible(seminarId))
  const posts = postsData ?? []

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

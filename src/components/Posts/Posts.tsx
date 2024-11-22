import {Stack, Typography} from '@mui/material'
// new MUI Grid without spacing issues: https://mui.com/material-ui/react-grid2/
import Grid from '@mui/material/Unstable_Grid2'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useState} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

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

  const {seminarId} = useSeminarInfo()

  const [activePostDetailIndex, setActivePostDetailIndex] = useState<number>()

  if (postsIsLoading) return <Loading />

  if (postsError) return <Typography>{postsError.message}</Typography>

  return (
    <>
      {/* detail prispevku chceme zobrazit na urovni toho prispevku - `activePostDetailIndex` teda rozdeluje prispevky na dva gridy:
        - prvy grid su vsetky prispevky do rozbaleneho prispevku - len jeden grid item ako jeden stlpec prispevkov (`xs={4}` ako 4 stlpce z 12)
        - druhy grid su prispevky od rozbaleneho prispevku - dva grid itemy ako jeden stlpec prispevkov (`xs={4}`) a druhy stlpec ako detail prispevku (`xs={5}` - detail je sirsi) */}
      {activePostDetailIndex !== 0 && (
        <Grid container disableEqualOverflow columnSpacing={5} mb={5}>
          <Grid xs={12} sm={6} md={4}>
            <Stack gap={5}>
              {posts.slice(0, activePostDetailIndex).map((post, index) => {
                if (!post.sites.includes(seminarId)) return null
                return <Post key={post.id} {...post} openDetail={() => setActivePostDetailIndex(index)} />
              })}
            </Stack>
          </Grid>
        </Grid>
      )}
      {activePostDetailIndex !== undefined && (
        <Grid container columnSpacing={5}>
          <Grid xs={12} sm={6} md={4}>
            <Stack gap={5}>
              {posts.slice(activePostDetailIndex).map((post, index) => {
                if (!post.sites.includes(seminarId)) return null
                return (
                  <Post
                    key={post.id}
                    {...post}
                    openDetail={() => setActivePostDetailIndex(activePostDetailIndex + index)}
                  />
                )
              })}
            </Stack>
          </Grid>
          <Grid xs={12} sm={6} lg={5} mt={{xs: 2, sm: 0}}>
            <PostDetail caption={posts[activePostDetailIndex].caption} details={posts[activePostDetailIndex].details} />
          </Grid>
        </Grid>
      )}
    </>
  )
}

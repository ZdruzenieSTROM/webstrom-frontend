import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {Loading} from '../Loading/Loading'
import {IPost, Post} from './Post'
import styles from './Posts.module.scss'

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

  return (
    <>
      {postsIsLoading && <Loading />}
      <ul className={styles.postsList}>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </ul>
      {postsError && <p>{postsError.message}</p>}
    </>
  )
}

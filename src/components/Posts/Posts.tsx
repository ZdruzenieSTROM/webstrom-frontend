import axios, {AxiosError} from 'axios'
import {FC, useEffect, useState} from 'react'

import {Loading} from '../Loading/Loading'
import {IPost, Post} from './Post'
import styles from './Posts.module.scss'

export const Posts: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<IPost[]>('/api/cms/post/visible', {
          headers: {
            'Content-type': 'application/json',
          },
        })
        setPosts(data)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {loading && <Loading />}
      <ul className={styles.postsList}>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </ul>
      {error && <p>{error}</p>}
    </>
  )
}

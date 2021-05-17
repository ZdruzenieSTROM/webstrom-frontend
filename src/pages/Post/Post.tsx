import './Post.css'

import axios, {AxiosError} from 'axios'
import React, {useEffect, useState} from 'react'
import {FC} from 'react'

interface IPost {
  id: number
  links: {id: number; caption: string; url: string}[]
  caption: string
  short_text: string
  details: string
  added_at: string
  show_after: string
  disable_after: string
  sites: number[]
}

export const Posts: FC<{seminarid: number}> = ({seminarid}) => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<IPost[]>('/api/cms/post/visible/', {
          headers: {
            'Content-type': 'application/json',
          },
        })
        setPosts(data)
      } catch (e) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function returnPost(seminarid: number, post: IPost) {
    if (post.sites.includes(seminarid)) {
      return (
        <li key={post.id}>
          <h2>{post.caption}</h2>
          <h3>{post.short_text}</h3>
          {post.links.map((link) => (
            <p key={link.id}>
              <h3>
                <a href={link.url}>{link.caption}</a>
              </h3>
            </p>
          ))}
          <h5>PODROBNOSTI</h5>
        </li>
      )
    }
  }

  return (
    <div id="posts">
      <ul className="post">{posts.map((post) => returnPost(seminarid, post))}</ul>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

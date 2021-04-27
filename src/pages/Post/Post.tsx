import './Post.css'

import axios, {AxiosError} from 'axios'
import React, {FC, useEffect, useState} from 'react'

interface IPost {
  id: number
  links: {id: number; caption: string; url: string}[]
  caption: string
  short_text: string
  details: string
  added_at: string
  show_after: string
  disable_after: string
}

export const Posts: FC = () => {
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

  return (
    <div id="posts">
      <ul id="post">
        {posts.map(({id, caption, short_text, links}) => (
          <li key={id}>
            <h2 id="bold">{caption}</h2>
            <h3>{short_text}</h3>
            {links.map(({id, url, caption}) => (
              <p key={id}>
                <h3>
                  <a href={url}>{caption}</a>
                </h3>
              </p>
            ))}
            <h5 id="bold">PODROBNOSTI</h5>
          </li>
        ))}
      </ul>
      {error && <p>{error}</p>}
    </div>
  )
}

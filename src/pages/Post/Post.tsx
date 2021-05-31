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
  sites: number[]
}

export const Posts: FC<{seminarId: number}> = ({seminarId}) => {
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

  const returnPost = ({id, caption, short_text, links, sites}: IPost) =>
    sites.includes(seminarId) && (
      <li key={id}>
        <h2>{caption}</h2>
        <h3>{short_text}</h3>
        {links.map(({id, url, caption}) => (
          <p key={id}>
            <h3>
              <a href={url}>{caption}</a>
            </h3>
          </p>
        ))}
        <h5>PODROBNOSTI</h5>
      </li>
    )

  return (
    <div className="posts">
      <ul className="post">{posts.map((post) => returnPost(post))}</ul>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

import './Post.css'

import React, {useEffect, useState} from 'react'
import { FC } from 'react'

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
  const [posts, setPosts] = useState(defaultPosts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    try {
      fetch('/api/cms/post/visible/', {
        headers: {
          'Content-type': 'application/json',
        },
      }).then(
        response => {
          if (response.ok) {
            response.json().then(data => {
              setPosts(data)
            })
          } else {
            setError("Network response is not ok.")
          }
        }
      )
      
    } catch (ex) {
      const error = ex.response.status === 404 ? 'Resource Not found' : 'An unexpected error has occurred'
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div id="posts">
      <ul id="post">
        {posts.map((post) => (
          <li key={post.id}>
            <h2 id="bold">{post.caption}</h2>
            <h3>{post.short_text}</h3>
            {post.links.map((link) => (
              <p key={link.id}>
                <h3>
                  <a href={link.url}>{link.caption}</a>
                </h3>
              </p>
            ))}
            <h5 id="bold">PODROBNOSTI</h5>
          </li>
        ))}
      </ul>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

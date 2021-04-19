/* eslint-disable prettier/prettier */
import './Post.css'

import axios from 'axios'
import React, {useEffect, useState } from 'react'

interface IPost {
    id: number,
    links: {id: number, caption: string, url: string}[],
    caption: string, 
    short_text: string, 
    details: string,
    added_at: string,
    show_after: string,
    disable_after: string
}

const defaultPosts: IPost[] = []

export const Posts: React.FC = () => {
  const [posts, setPosts] = useState(defaultPosts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
    
    useEffect(() => {
        axios.get<IPost[]>('/api/cms/post/visible/', {
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(response => {
            setPosts(response.data)
            setLoading(false)
        })
        .catch(ex => {
            const error =
            ex.response.status === 404
                ? "Resource Not found"
                : "An unexpected error has occurred"
            setError(error)
            setLoading(false)
        })
    }, [])

    return(
        <div id="posts">
            <ul id="post">
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2 id="bold">{post.caption}</h2>
                        <h3>{post.short_text}</h3>
                        {post.links.map((link) => (
                            <p key={link.id}><h3><a href={link.url}>{link.caption}</a></h3></p>
                        ))}
                        <h5 id="bold">PODROBNOSTI</h5>
                    </li>
                ))}
            </ul>
            {error && <p className="error">{error}</p>}
        </div>
    )
}

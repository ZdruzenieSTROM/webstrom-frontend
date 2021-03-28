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
    const [posts, setPosts]: [IPost[], (posts: IPost[]) => void] = useState(defaultPosts)
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true)
    const [error, setError]: [string, (error: string) => void] = React.useState("")
    
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
                        <h3>{post.caption}</h3>
                        <p>{post.short_text}</p>
                    </li>
                ))}
            </ul>
            {error && <p className="error">{error}</p>}
        </div>
    )
}

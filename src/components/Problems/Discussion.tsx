import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'

import {AuthContainer} from '@/utils/AuthContainer'

import styles from './Discussion.module.scss'
import problemStyles from './Problems.module.scss'
import {SideContainer} from './SideContainer'

interface Comments {
  id: number
  edit_allowed: boolean
  text: string
  posted_at: string
  published: boolean
  problem: number
  posted_by: number
}

interface Comment {
  id: number
  can_edit: boolean
  text: string
  published: boolean
  posted_by: number
  name: string
}

// ToDo: move to the other interfaces
interface DiscussionProps {
  problemId: number
  problemNumber: number
}

export const Discussion: FC<DiscussionProps> = ({problemId, problemNumber}) => {
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  // ToDo: find out whether the user can publish comments form the api
  const [canPublish, setCanPublish] = useState(true)
  const [reloadComments, setReloadComments] = useState(true)
  const {user} = AuthContainer.useContainer()

  // trigger comments reload whenever problemId changes
  useEffect(() => {
    setReloadComments(true)
  }, [problemId, user])

  // Fetch comments for the problem with id === problemId
  useEffect(() => {
    setLoading(true)
    if (reloadComments === true) {
      setCommentText('')

      const fetchComments = async () => {
        try {
          const {data} = await axios.get<Comments[]>(`/api/competition/problem/${problemId}/comments`)

          const comments = data.map((comment) => {
            return {
              id: comment.id,
              can_edit: comment.edit_allowed,
              text: comment.text,
              published: comment.published,
              posted_by: comment.posted_by, // ToDo: change after api change
              name: comment.posted_by.toString(), // ToDo: change after api change
            }
          })

          setComments(comments)
          setLoading(false)
        } catch (e: unknown) {
          const ex = e as AxiosError
          // TODO: show error somewhere
          const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
          setComments([])
        } finally {
          setLoading(false)
        }
      }

      fetchComments()
      setReloadComments(false)
    }
  }, [problemId, reloadComments])

  const handleCommentSubmit = async () => {
    // ToDo: handle comment submit
    try {
      await axios.post(`/api/competition/problem/${problemId}/add-comment`, {
        text: commentText,
      })
      setReloadComments(true)
      // ToDo: use data to show message?
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
    } finally {
      // TODO: handle loading?
    }
  }

  const handleCommentChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setCommentText(e.currentTarget.value)
  }

  const hideComment = async (id: number) => {
    try {
      await axios.post('/api/competition/comment/' + id + '/hide/')
      setReloadComments(true)
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      // ToDo: handle error
    }
  }

  const publishComment = async (id: number) => {
    try {
      await axios.post('/api/competition/comment/' + id + '/publish/')
      setReloadComments(true)
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      // ToDo: handle error
    }
  }

  const deleteComment = async (id: number) => {
    // ToDo: add one extra check before deleting the post
    try {
      await axios.delete('/api/competition/comment/' + id + '/')
      setReloadComments(true)
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      // ToDo: handle error
    }
  }

  return (
    <SideContainer title={'Diskusia - úloha ' + problemNumber}>
      <div className={styles.discussionBox}>
        <div className={styles.comments}>
          {/* ToDo: replace by loading component that does not exist yet */}
          {/* {loading && <div>Loading...</div>} */}
          {!loading &&
            comments.map((comment) => (
              <div className={clsx(styles.comment, !comment.published && styles.notPublished)} key={comment.id}>
                <div className={styles.title}>
                  {!comment.published && (
                    <>
                      (not published)
                      <br />
                    </>
                  )}
                  {comment.name}
                </div>
                <div>{comment.text}</div>
                <div className={styles.commentActions}>
                  {!comment.published && (
                    <>
                      {canPublish && (
                        <span
                          onClick={() => {
                            publishComment(comment.id)
                          }}
                        >
                          Publish
                        </span>
                      )}
                      <span
                        onClick={() => {
                          deleteComment(comment.id)
                        }}
                      >
                        Delete
                      </span>
                    </>
                  )}
                  {comment.published && (
                    <>
                      {canPublish && (
                        <span
                          onClick={() => {
                            hideComment(comment.id)
                          }}
                        >
                          Hide
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className={styles.textArea}>
          <textarea value={commentText} onChange={handleCommentChange} />
          <span onClick={() => handleCommentSubmit()} className={problemStyles.actionButton}>
            Odoslať
          </span>
        </div>
      </div>
    </SideContainer>
  )
}
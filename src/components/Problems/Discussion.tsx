import {CircularProgress} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'

import {Comment} from '@/types/api/competition'
import {AuthContainer} from '@/utils/AuthContainer'

import {Button} from '../Clickable/Clickable'
import styles from './Discussion.module.scss'
import {SideContainer} from './SideContainer'

interface DiscussionProps {
  problemId: number
  problemNumber: number
}

export const Discussion: FC<DiscussionProps> = ({problemId, problemNumber}) => {
  const [commentText, setCommentText] = useState('')
  // TODO: get this from the comments endpoint - task for BE
  const [canPublish, setCanPublish] = useState(true)
  const {isAuthed} = AuthContainer.useContainer()

  // ked sa prihlasime alebo odhlasime, treba refetchnut komentare, lebo obsahuju aj user-specific data
  // TODO: zvazit, ci to chceme presunut na ine (globalne) miesto, kde budeme invalidovat vsetky user-specific queries spolocne
  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ['competition', 'problem', problemId, 'comments']})
    // nechceme manualne invalidovat, ked sa zmeni nieco ine ako `isAuthed`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  const {data: commentsData, isLoading: commentsIsLoading} = useQuery({
    queryKey: ['competition', 'problem', problemId, 'comments'],
    queryFn: () => axios.get<Comment[]>(`/api/competition/problem/${problemId}/comments`),
  })
  const comments = commentsData?.data.map((comment) => ({
    id: comment.id,
    can_edit: comment.edit_allowed,
    text: comment.text,
    published: comment.published,
    posted_by: comment.posted_by_name,
  }))

  const queryClient = useQueryClient()

  const {mutate: addComment} = useMutation({
    mutationFn: () => axios.post(`/api/competition/problem/${problemId}/add-comment`, {text: commentText}),
    onSuccess: () => {
      setCommentText('')
      queryClient.invalidateQueries({queryKey: ['competition', 'problem', problemId, 'comments']})
    },
  })

  const {mutate: publishComment} = useMutation({
    mutationFn: (id: number) => axios.post(`/api/competition/comment/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['competition', 'problem', problemId, 'comments']})
    },
  })

  const {mutate: hideComment} = useMutation({
    mutationFn: (id: number) => axios.post(`/api/competition/comment/${id}/hide`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['competition', 'problem', problemId, 'comments']})
    },
  })

  const {mutate: deleteComment} = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/competition/comment/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['competition', 'problem', problemId, 'comments']})
    },
  })

  const handleCommentChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setCommentText(e.currentTarget.value)
  }

  return (
    <SideContainer title={'Diskusia - úloha ' + problemNumber}>
      <div className={styles.container}>
        <div className={styles.comments}>
          {commentsIsLoading && (
            <div className={styles.loading}>
              <CircularProgress color="inherit" />
            </div>
          )}
          {comments &&
            comments.map((comment) => (
              <div className={clsx(styles.comment, !comment.published && styles.notPublished)} key={comment.id}>
                <div className={styles.title}>
                  {!comment.published && (
                    <>
                      (not published)
                      <br />
                    </>
                  )}
                  {comment.posted_by}
                </div>
                <div>{comment.text}</div>
                <div className={styles.commentActions}>
                  {!comment.published && (
                    <>
                      {canPublish && <Button onClick={() => publishComment(comment.id)}>Publish</Button>}
                      <Button onClick={() => deleteComment(comment.id)}>Delete</Button>
                    </>
                  )}
                  {comment.published && (
                    <>{canPublish && <Button onClick={() => hideComment(comment.id)}>Hide</Button>}</>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className={styles.textArea}>
          <textarea value={commentText} onChange={handleCommentChange} />
          <Button onClick={addComment}>Odoslať</Button>
        </div>
      </div>
    </SideContainer>
  )
}

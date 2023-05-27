import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import {FC, useState} from 'react'

import {Comment, CommentState} from '@/types/api/competition'
import {AuthContainer} from '@/utils/AuthContainer'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Button} from '../Clickable/Clickable'
import {Loading} from '../Loading/Loading'
import styles from './Discussion.module.scss'
import {SideContainer} from './SideContainer'

interface DiscussionProps {
  problemId: number
  problemNumber: number
  closeDiscussion: () => void
}

export const Discussion: FC<DiscussionProps> = ({problemId, problemNumber, closeDiscussion}) => {
  const [commentText, setCommentText] = useState('')
  const [hiddenResponseText, setHiddenResponseText] = useState('')
  const [hiddenResponseDialogId, sethiddenResponseDialogId] = useState(-1)

  const {data: commentsData, isLoading: commentsIsLoading} = useQuery({
    queryKey: ['competition', 'problem', problemId, 'comments'],
    queryFn: () => axios.get<Comment[]>(`/api/competition/problem/${problemId}/comments`),
  })
  const comments = commentsData?.data.map((comment) => ({
    id: comment.id,
    can_edit: comment.edit_allowed,
    text: comment.text,
    state: comment.state,
    hidden_response: comment.hidden_response,
    posted_by: comment.posted_by_name,
  }))

  const {hasPermissions} = useHasPermissions()

  const {isAuthed} = AuthContainer.useContainer()

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
    mutationFn: (id: number) =>
      axios.post(`/api/competition/comment/${id}/hide`, {hidden_response: hiddenResponseText}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['competition', 'problem', problemId, 'comments']})
      sethiddenResponseDialogId(-1)
      setHiddenResponseText('')
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
  const handleHiddenResponseChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setHiddenResponseText(e.currentTarget.value)
  }

  return (
    <SideContainer title={'Diskusia - úloha ' + problemNumber} onClose={closeDiscussion}>
      <div className={styles.container}>
        <div className={styles.comments}>
          {commentsIsLoading && <Loading />}
          {comments &&
            comments.map((comment) => (
              <div
                className={clsx(styles.comment, !(comment.state === CommentState.Published) && styles.notPublished)}
                key={comment.id}
              >
                <div className={styles.title}>
                  <div>{comment.posted_by}</div>
                </div>
                <div>{comment.text}</div>
                {comment.hidden_response && (
                  <>
                    <div className={styles.title}>
                      <div>Vedúci:</div>
                    </div>
                    <div>{comment.hidden_response}</div>
                  </>
                )}
                {comment.state === CommentState.WaitingForReview && <div>* komentár čaká na schválenie</div>}
                {comment.state === CommentState.Hidden && <div>* tento komentár nie je verejný</div>}
                {hiddenResponseDialogId === comment.id ? (
                  <div className={styles.textArea}>
                    <textarea value={hiddenResponseText} onChange={handleHiddenResponseChange} />
                    <div className={styles.commentActions}>
                      <Button onClick={() => hideComment(comment.id)}>Odoslať</Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.commentActions}>
                    {!(comment.state === CommentState.Published) && hasPermissions && (
                      <Button onClick={() => publishComment(comment.id)}>Zverejniť</Button>
                    )}
                    {!(comment.state === CommentState.Hidden) && hasPermissions && (
                      <Button onClick={() => sethiddenResponseDialogId(comment.id)}>Skryť</Button>
                    )}
                    {comment.state === CommentState.WaitingForReview && !hasPermissions && (
                      <Button onClick={() => deleteComment(comment.id)}>Vymazať</Button>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
        <div className={styles.textArea}>
          <textarea value={commentText} onChange={handleCommentChange} />
          <Button disabled={!isAuthed} onClick={addComment}>
            Odoslať
          </Button>
        </div>
      </div>
    </SideContainer>
  )
}

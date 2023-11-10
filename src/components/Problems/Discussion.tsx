import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import {FC, useState} from 'react'

import {Comment, CommentState} from '@/types/api/competition'
import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Button} from '../Clickable/Clickable'
import {Dialog} from '../Dialog/Dialog'
import {Loading} from '../Loading/Loading'
import styles from './Discussion.module.scss'
import {SideContainer} from './SideContainer'

interface DiscussionProps {
  problemId: number
  problemNumber: number
  closeDiscussion: () => void
  invalidateSeriesQuery: () => Promise<void>
}

export const Discussion: FC<DiscussionProps> = ({problemId, problemNumber, closeDiscussion, invalidateSeriesQuery}) => {
  const [commentText, setCommentText] = useState('')
  const [hiddenResponseText, setHiddenResponseText] = useState('')
  const [hiddenResponseDialogId, sethiddenResponseDialogId] = useState(-1)
  const [deleteDialogId, setDeleteDialogId] = useState<number | undefined>()

  const queryKey = ['competition', 'problem', problemId, 'comments']
  const {data: commentsData, isLoading: commentsIsLoading} = useQuery({
    queryKey,
    queryFn: () => axios.get<Comment[]>(`/api/competition/problem/${problemId}/comments`),
  })
  const comments = commentsData?.data

  const {hasPermissions} = useHasPermissions()

  const {isAuthed} = AuthContainer.useContainer()

  const {data} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => axios.get<Profile>(`/api/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const userId = data?.data.id

  const queryClient = useQueryClient()

  const invalidateCommentsAndCount = async () => {
    await Promise.all([
      queryClient.invalidateQueries({queryKey}),
      // comment count comes from problem from series
      invalidateSeriesQuery(),
    ])
  }

  const {mutate: addComment} = useMutation({
    mutationFn: () => axios.post(`/api/competition/problem/${problemId}/add-comment`, {text: commentText}),
    onSuccess: () => {
      setCommentText('')
      invalidateCommentsAndCount()
    },
  })

  const {mutate: publishComment} = useMutation({
    mutationFn: (id: number) => axios.post(`/api/competition/comment/${id}/publish`),
    onSuccess: () => {
      invalidateCommentsAndCount()
    },
  })

  const {mutate: hideComment} = useMutation({
    mutationFn: ({id, hiddenResponseText}: {id: number; hiddenResponseText: string}) =>
      axios.post(`/api/competition/comment/${id}/hide`, {hidden_response: hiddenResponseText}),
    onSuccess: () => {
      invalidateCommentsAndCount()
      sethiddenResponseDialogId(-1)
      setHiddenResponseText('')
    },
  })

  const {mutate: confirmDeleteComment} = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/competition/comment/${id}`),
    onSuccess: () => {
      invalidateCommentsAndCount()
    },
  })

  const handleCommentChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setCommentText(e.currentTarget.value)
  }
  const handleHiddenResponseChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setHiddenResponseText(e.currentTarget.value)
  }

  const close = () => setDeleteDialogId(undefined)
  const agree = () => {
    deleteDialogId !== undefined ? confirmDeleteComment(deleteDialogId) : undefined
    close()
  }

  return (
    <SideContainer title={'Diskusia - úloha ' + problemNumber} onClose={closeDiscussion}>
      {/* delete comment dialog */}
      <Dialog
        open={deleteDialogId !== undefined}
        close={close}
        title="Vymazať komentár?"
        contentText="Komentár bude nenávratne vymazaný."
        actions={
          <>
            <Button onClick={close}>Zavrieť</Button>
            <Button onClick={agree}>Potvrdiť</Button>
          </>
        }
      />
      <div className={styles.container}>
        <div className={styles.comments}>
          {commentsIsLoading && <Loading />}
          {comments &&
            comments.map((comment) => {
              const isPostedByMe = userId === comment.posted_by

              return (
                <div
                  className={clsx(styles.comment, comment.state !== CommentState.Published && styles.notPublished)}
                  key={comment.id}
                >
                  <div className={styles.title}>
                    <div>{comment.posted_by_name}</div>
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
                    <div className={styles.inputContainer}>
                      <textarea
                        className={styles.textArea}
                        value={hiddenResponseText}
                        onChange={handleHiddenResponseChange}
                      />
                      <div className={styles.commentActions}>
                        <Button onClick={() => hideComment({id: comment.id, hiddenResponseText})}>Odoslať</Button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.commentActions}>
                      {comment.state !== CommentState.Published && hasPermissions && (
                        <Button onClick={() => publishComment(comment.id)}>Zverejniť</Button>
                      )}
                      {comment.state !== CommentState.Hidden && hasPermissions && (
                        <Button onClick={() => sethiddenResponseDialogId(comment.id)}>Skryť</Button>
                      )}
                      {/* veduci moze zmazat svoj komentar v hocijakom stave, ucastnik moze zmazat svoj nepublishnuty komentar */}
                      {isPostedByMe && (hasPermissions || comment.state !== CommentState.Published) && (
                        <Button onClick={() => setDeleteDialogId(comment.id)}>Vymazať</Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
        <div className={styles.submitInputContainer}>
          <textarea className={styles.textArea} value={commentText} onChange={handleCommentChange} />
          <div className={styles.submitAction}>
            <Button disabled={!isAuthed} onClick={addComment}>
              Odoslať
            </Button>
          </div>
        </div>
      </div>
    </SideContainer>
  )
}

import {Stack, Typography} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {FC, useState} from 'react'

import {apiAxios} from '@/api/apiAxios'
import {Comment, CommentState} from '@/types/api/competition'
import {AuthContainer} from '@/utils/AuthContainer'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useProfile} from '@/utils/useProfile'

import {Button} from '../Clickable/Button'
import {Dialog} from '../Dialog/Dialog'
import {Loading} from '../Loading/Loading'

interface DiscussionProps {
  problemId?: number
  invalidateSeriesQuery: () => Promise<void>
}

export const Discussion: FC<DiscussionProps> = ({problemId, invalidateSeriesQuery}) => {
  const [commentText, setCommentText] = useState('')
  const [hiddenResponseText, setHiddenResponseText] = useState('')
  const [hiddenResponseDialogId, sethiddenResponseDialogId] = useState<number>()
  const [deleteDialogId, setDeleteDialogId] = useState<number | undefined>()

  const queryKey = ['competition', 'problem', problemId, 'comments']
  const {data: commentsData, isLoading: commentsIsLoading} = useQuery({
    queryKey,
    queryFn: () => apiAxios.get<Comment[]>(`/competition/problem/${problemId}/comments`),
    enabled: problemId !== undefined,
  })
  const comments = commentsData?.data

  const {hasPermissions} = useHasPermissions()

  const {isAuthed} = AuthContainer.useContainer()

  const {profile} = useProfile()
  const userId = profile?.id

  const queryClient = useQueryClient()

  const invalidateCommentsAndCount = async () => {
    await Promise.all([
      queryClient.invalidateQueries({queryKey}),
      // comment count comes from problem from series
      invalidateSeriesQuery(),
    ])
  }

  const {mutate: addComment, isPending: isPending} = useMutation({
    mutationFn: () => apiAxios.post(`/competition/problem/${problemId}/add-comment`, {text: commentText}),
    onSuccess: () => {
      setCommentText('')
      invalidateCommentsAndCount()
    },
  })

  const {mutate: publishComment} = useMutation({
    mutationFn: (id: number) => apiAxios.post(`/competition/comment/${id}/publish`),
    onSuccess: () => {
      invalidateCommentsAndCount()
    },
  })

  const {mutate: hideComment} = useMutation({
    mutationFn: ({id, hiddenResponseText}: {id: number; hiddenResponseText: string}) =>
      apiAxios.post(`/competition/comment/${id}/hide`, {hidden_response: hiddenResponseText}),
    onSuccess: () => {
      invalidateCommentsAndCount()
      sethiddenResponseDialogId(undefined)
      setHiddenResponseText('')
    },
  })

  const {mutate: confirmDeleteComment} = useMutation({
    mutationFn: (id: number) => apiAxios.delete(`/competition/comment/${id}`),
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
    if (deleteDialogId !== undefined) confirmDeleteComment(deleteDialogId)
    close()
  }

  return (
    <>
      {/* delete comment dialog */}
      <Dialog
        open={deleteDialogId !== undefined}
        close={close}
        title="Vymazať komentár?"
        contentText="Komentár bude nenávratne vymazaný."
        actions={
          <>
            <Button variant="button2" onClick={agree}>
              Potvrdiť
            </Button>
            <Button variant="button2" onClick={close}>
              Zavrieť
            </Button>
          </>
        }
      />
      <Stack gap={1} sx={{overflow: 'hidden'}}>
        <Stack gap={1} sx={{overflowY: 'auto', overscrollBehaviorY: 'contain'}}>
          {commentsIsLoading && <Loading />}
          {comments &&
            comments.map((comment) => {
              const isPostedByMe = userId === comment.posted_by

              return (
                <Stack sx={comment.state !== CommentState.Published ? {color: 'gray'} : {}} key={comment.id}>
                  <Typography variant="h3" component="span">
                    {comment.posted_by_name}
                  </Typography>
                  <Typography variant="body1" style={{wordBreak: 'break-word'}}>
                    {comment.text}
                  </Typography>
                  {comment.hidden_response && (
                    <Stack ml={2}>
                      <Typography variant="h3" component="span">
                        Vedúci:
                      </Typography>
                      <Typography variant="body1">{comment.hidden_response}</Typography>
                    </Stack>
                  )}
                  {comment.state === CommentState.WaitingForReview && (
                    <Typography variant="body3">* komentár čaká na schválenie</Typography>
                  )}
                  {comment.state === CommentState.Hidden && (
                    <Typography variant="body3">* tento komentár nie je verejný</Typography>
                  )}
                  {hiddenResponseDialogId === comment.id ? (
                    <Stack my={1} gap={1}>
                      <textarea
                        style={{width: '100%', height: '60px', border: '3px solid black'}}
                        value={hiddenResponseText}
                        onChange={handleHiddenResponseChange}
                      />
                      <Stack alignSelf="end">
                        <Button onClick={() => hideComment({id: comment.id, hiddenResponseText})} variant="button3">
                          Odoslať
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack gap={1} alignSelf="end" direction="row">
                      {comment.state !== CommentState.Published && hasPermissions && (
                        <Button onClick={() => publishComment(comment.id)} variant="button3">
                          Zverejniť
                        </Button>
                      )}
                      {comment.state !== CommentState.Hidden && hasPermissions && (
                        <Button onClick={() => sethiddenResponseDialogId(comment.id)} variant="button3">
                          Skryť
                        </Button>
                      )}
                      {/* veduci moze zmazat svoj komentar v hocijakom stave, ucastnik moze zmazat svoj nepublishnuty komentar */}
                      {isPostedByMe && (hasPermissions || comment.state !== CommentState.Published) && (
                        <Button onClick={() => setDeleteDialogId(comment.id)} variant="button3">
                          Vymazať
                        </Button>
                      )}
                    </Stack>
                  )}
                </Stack>
              )
            })}
        </Stack>

        <Stack gap={1}>
          {isAuthed ? (
            <>
              <textarea
                style={{width: '100%', height: '60px', border: '3px solid black'}}
                value={commentText}
                onChange={handleCommentChange}
              />
              <Stack alignSelf="end">
                <Button
                  variant="button2"
                  onClick={() => addComment()}
                  disabled={isPending || !commentText}
                >
                  Odoslať
                </Button>
              </Stack>
            </>
          ) : (
            <Typography variant="body2" sx={{color: 'gray'}}>
              Prispievať do diskusie môžu len prihlásení uživatelia.
            </Typography>
          )}
        </Stack>
      </Stack>
    </>
  )
}

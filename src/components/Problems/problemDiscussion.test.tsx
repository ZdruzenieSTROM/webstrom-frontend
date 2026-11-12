import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse} from 'msw/http'
import {describe, expect, it} from 'vitest'

import {Account, apiUrl, createSession, makeAccount} from '@/test-utils/api'
import {makeComment, makeProblem, makeSeriesWithProblems} from '@/test-utils/fixtures'
import {problemsPageHandlers, renderProblemsPage} from '@/test-utils/problemsPage'
import {findDialog} from '@/test-utils/render'
import {server} from '@/test-utils/server'
import {Comment, CommentState} from '@/types/api/competition'

const staff = makeAccount({permissions: {is_staff: false, is_superuser: false, competition_permissions: [0]}})

// Someone else than the signed-in account (whose profile has user_id 1).
const otherParticipant = {posted_by: 2, posted_by_name: 'Peter Druhý'}

/**
 * The backend behind the discussion of problem 101. Like the real one, it shows a visitor the published
 * comments, a participant also their own, and the staff of the seminar all of them - and counts the
 * comments of a problem the same way.
 */
const startBackend = ({
  signedIn,
  account = makeAccount(),
  comments: initialComments = [],
}: {
  signedIn: boolean
  account?: Account
  comments?: Comment[]
}) => {
  const session = createSession({account, signedIn})
  const comments = [...initialComments]
  let nextCommentId = 950

  const isStaff = () => session.isSignedIn() && account.permissions.competition_permissions.includes(0)
  const visibleComments = () =>
    comments.filter(
      (comment) =>
        isStaff() ||
        comment.state === CommentState.Published ||
        (session.isSignedIn() && comment.posted_by === account.profile.user_id),
    )
  const findComment = (id: unknown) => comments.find((comment) => comment.id === Number(id))

  server.use(
    ...session.handlers,
    ...problemsPageHandlers(() =>
      makeSeriesWithProblems({problems: [makeProblem({num_comments: visibleComments().length})]}),
    ),
    http.get(apiUrl('/competition/problem/101/comments/'), () => HttpResponse.json(visibleComments())),
    http.post(apiUrl('/competition/problem/101/add-comment/'), async ({request}) => {
      const {text} = (await request.json()) as {text: string}
      const comment = makeComment({
        id: nextCommentId++,
        text,
        state: CommentState.WaitingForReview,
        posted_by: account.profile.user_id,
      })
      comments.push(comment)
      return HttpResponse.json(comment, {status: 201})
    }),
    http.post(apiUrl('/competition/comment/:id/publish/'), ({params}) => {
      const comment = findComment(params.id)
      if (!comment) return new HttpResponse(null, {status: 404})
      comment.state = CommentState.Published
      comment.hidden_response = null
      return HttpResponse.json(comment)
    }),
    http.post(apiUrl('/competition/comment/:id/hide/'), async ({params, request}) => {
      const comment = findComment(params.id)
      if (!comment) return new HttpResponse(null, {status: 404})
      const {hidden_response} = (await request.json()) as {hidden_response: string}
      comment.state = CommentState.Hidden
      comment.hidden_response = hidden_response
      return HttpResponse.json(comment)
    }),
    http.delete(apiUrl('/competition/comment/:id/'), ({params}) => {
      const comment = findComment(params.id)
      if (!comment) return new HttpResponse(null, {status: 404})
      comments.splice(comments.indexOf(comment), 1)
      return new HttpResponse(null, {status: 204})
    }),
  )

  return {comments}
}

const openDiscussion = async (user: ReturnType<typeof userEvent.setup>, commentCount: number) => {
  await user.click(screen.getByRole('button', {name: `diskusia (${commentCount})`}))
  // The title joins the number with a non-breaking space, which the accessible name keeps.
  return findDialog('Diskusia - úloha\u00A01')
}

describe('problem discussion', () => {
  it('shows an anonymous visitor the published comments and asks them to sign in to post', async () => {
    const user = userEvent.setup()
    startBackend({signedIn: false, comments: [makeComment({...otherParticipant, text: 'Treba aj dôkaz?'})]})
    await renderProblemsPage()

    const discussion = await openDiscussion(user, 1)

    expect(await discussion.findByText('Treba aj dôkaz?')).toBeInTheDocument()
    expect(discussion.getByText('Prispievať do diskusie môžu len prihlásení uživatelia.')).toBeInTheDocument()
    expect(discussion.queryByRole('textbox')).not.toBeInTheDocument()
    expect(discussion.queryByRole('button', {name: 'Odoslať'})).not.toBeInTheDocument()
  })

  it('posts a participant comment for review and refreshes the comment count', async () => {
    const user = userEvent.setup()
    const {comments} = startBackend({signedIn: true})
    await renderProblemsPage()

    const discussion = await openDiscussion(user, 0)
    expect(discussion.getByRole('button', {name: 'Odoslať'})).toBeDisabled()
    await user.click(discussion.getByRole('textbox'))
    await user.type(discussion.getByRole('textbox'), 'Platí to aj pre záporné čísla?')
    await user.click(discussion.getByRole('button', {name: 'Odoslať'}))

    expect(await discussion.findByText('Platí to aj pre záporné čísla?')).toBeInTheDocument()
    expect(discussion.getByText('* komentár čaká na schválenie')).toBeInTheDocument()
    expect(discussion.getByRole('textbox')).toHaveValue('')
    expect(comments.map(({text}) => text)).toStrictEqual(['Platí to aj pre záporné čísla?'])
    // Reviewing comments is for the staff only.
    expect(discussion.queryByRole('button', {name: 'Zverejniť'})).not.toBeInTheDocument()
    // The page behind the open dialog is hidden from the accessibility tree.
    expect(await screen.findByRole('button', {name: 'diskusia (1)', hidden: true})).toBeInTheDocument()
  })

  it('lets a participant delete their own comment only while it is unpublished', async () => {
    const user = userEvent.setup()
    const {comments} = startBackend({
      signedIn: true,
      comments: [
        makeComment({id: 900, text: 'Už zverejnená otázka'}),
        makeComment({id: 901, text: 'Ešte neschválená otázka', state: CommentState.WaitingForReview}),
      ],
    })
    await renderProblemsPage()

    const discussion = await openDiscussion(user, 2)
    await discussion.findByText('Ešte neschválená otázka')
    // Only the unpublished comment offers deleting.
    await user.click(discussion.getByRole('button', {name: 'Vymazať'}))
    const confirmation = await findDialog('Vymazať komentár?')
    await user.click(confirmation.getByRole('button', {name: 'Potvrdiť'}))

    await waitFor(() => {
      expect(discussion.queryByText('Ešte neschválená otázka')).not.toBeInTheDocument()
    })
    expect(discussion.getByText('Už zverejnená otázka')).toBeInTheDocument()
    expect(comments.map(({id}) => id)).toStrictEqual([900])
  })

  it('lets the staff publish a comment waiting for review', async () => {
    const user = userEvent.setup()
    const {comments} = startBackend({
      signedIn: true,
      account: staff,
      comments: [makeComment({...otherParticipant, state: CommentState.WaitingForReview})],
    })
    await renderProblemsPage()

    const discussion = await openDiscussion(user, 1)
    await user.click(await discussion.findByRole('button', {name: 'Zverejniť'}))

    await waitFor(() => {
      expect(discussion.queryByText('* komentár čaká na schválenie')).not.toBeInTheDocument()
    })
    expect(comments[0].state).toBe(CommentState.Published)
  })

  it('warns the staff that publishing a comment drops their reply to it', async () => {
    const user = userEvent.setup()
    const {comments} = startBackend({
      signedIn: true,
      account: staff,
      comments: [
        makeComment({...otherParticipant, state: CommentState.Hidden, hidden_response: 'Áno, jednotku započítaj.'}),
      ],
    })
    await renderProblemsPage()

    const discussion = await openDiscussion(user, 1)
    await user.click(await discussion.findByRole('button', {name: 'Zverejniť'}))
    const confirmation = await findDialog('Zverejniť komentár?')
    expect(
      confirmation.getByText('Komentár obsahuje odpoveď vedúceho, ktorá bude po zverejnení stratená.'),
    ).toBeInTheDocument()
    await user.click(confirmation.getByRole('button', {name: 'Potvrdiť'}))

    await waitFor(() => {
      expect(discussion.queryByText('* tento komentár nie je verejný')).not.toBeInTheDocument()
    })
    expect(comments[0].state).toBe(CommentState.Published)
  })

  it('lets the staff hide a comment with a reply only its author sees', async () => {
    const user = userEvent.setup()
    const {comments} = startBackend({
      signedIn: true,
      account: staff,
      comments: [makeComment({...otherParticipant, state: CommentState.WaitingForReview})],
    })
    await renderProblemsPage()

    const discussion = await openDiscussion(user, 1)
    await user.click(await discussion.findByRole('button', {name: 'Skryť'}))
    const reply = discussion.getByRole('button', {name: 'Odpovedať na príspevok'})
    expect(reply).toBeDisabled()
    // The reply field opens under the comment, above the field for a new comment.
    const [replyField] = discussion.getAllByRole('textbox')
    await user.click(replyField)
    await user.type(replyField, 'Áno, jednotku započítaj.')
    await user.click(reply)

    expect(await discussion.findByText('* tento komentár nie je verejný')).toBeInTheDocument()
    expect(discussion.getByText('Vedúci:')).toBeInTheDocument()
    expect(discussion.getByText('Áno, jednotku započítaj.')).toBeInTheDocument()
    expect(comments[0]).toMatchObject({state: CommentState.Hidden, hidden_response: 'Áno, jednotku započítaj.'})
  })
})

import {Stack, Typography} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'
import {useInterval} from 'usehooks-ts'

import {apiOptions} from '@/api/api'
import {apiAxios} from '@/api/apiAxios'
import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useProfile} from '@/utils/useProfile'

import {InlineLink} from '../Clickable/InlineLink'
import {Dialog} from '../Dialog/Dialog'
import {Loading} from '../Loading/Loading'
import {LoginForm} from '../PageLayout/LoginForm/LoginForm'
import {Discussion} from './Discussion'
import {DiscussionProblem, Problem} from './Problem'

export const Problems: FC = () => {
  const {id, seminar, loading} = useDataFromURL()

  const router = useRouter()

  const {profile} = useProfile()

  const [discussionProblem, setDiscussionProblem] = useState<DiscussionProblem>()
  // separate state to prevent flash of "Diskusia - úloha undefined" in the dialog title
  const [discussionOpen, setDiscussionOpen] = useState(false)
  const openDiscussion = (problem: DiscussionProblem) => {
    setDiscussionProblem(problem)
    setDiscussionOpen(true)
  }
  const closeDiscussion = () => setDiscussionOpen(false)

  const {data: series, isLoading: seriesIsLoading} = useQuery(apiOptions.competition.series.byId(id.seriesId))

  const problems = series?.problems ?? []
  const canSubmit = series?.can_submit ?? false
  const canResubmit = series?.can_resubmit ?? false
  const [isAfterDeadline, setIsAfterDeadline] = useState<boolean>(new Date(series?.deadline ?? '') < new Date())

  useInterval(() => {
    const isAfterDeadlineNew = new Date(series?.deadline ?? '') < new Date()
    if (isAfterDeadlineNew !== isAfterDeadline) setIsAfterDeadline(isAfterDeadlineNew)
  }, 500)

  const canRegister = series?.can_participate ?? false
  const isRegistered = series?.is_registered ?? false

  const queryClient = useQueryClient()

  const invalidateSeriesQuery = async () => {
    const seriesQuery = apiOptions.competition.series.byId(id.seriesId)
    if (seriesQuery.enabled) {
      await queryClient.invalidateQueries({queryKey: seriesQuery.queryKey})
    }
  }

  const {mutate: registerToSemester} = useMutation({
    mutationFn: (id: number) => apiAxios.post(`/competition/event/${id}/register`),
    onSuccess: () => {
      // refetch semestra, nech sa aktualizuje is_registered
      invalidateSeriesQuery()
    },
  })

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  const [displayRegisterDialog, setDisplayRegisterDialog] = useState<boolean>(false)
  const closeRegisterDialog = () => setDisplayRegisterDialog(false)
  const editProfile = () => {
    closeRegisterDialog()
    router.push(`/${seminar}/profil/uprava`)
  }
  const agree = () => {
    if (series?.semester == null) return
    if (displayRegisterDialog) registerToSemester(series.semester)
    closeRegisterDialog()
  }

  const [displayLoginDialog, setDisplayLoginDialog] = useState<boolean>(false)
  const closeLoginDialog = () => setDisplayLoginDialog(false)
  const {params} = router.query
  const rulesLink = `/${seminar}/akcie/${seminar}/pravidla`
  const resultsLink = params
    ? `/${seminar}/poradie/${Array.isArray(params) ? params.join('/') : params}`
    : `/${seminar}/poradie`

  return (
    <>
      <Dialog
        open={displayRegisterDialog}
        close={closeRegisterDialog}
        title="Kontrola údajov"
        actions={
          <>
            <Button variant="button2" onClick={agree}>
              Údaje sú správne
            </Button>
            <Button variant="button2" onClick={editProfile}>
              Zmeniť údaje
            </Button>
          </>
        }
      >
        <Stack gap={2}>
          <Typography variant="h3" component="span" textAlign="center">
            Skontroluj prosím, či údaje o&nbsp;ročníku a škole sú správne.
          </Typography>
          <Stack direction={'row'} gap={1}>
            <Typography variant="h3" component="span">
              Škola
            </Typography>
            <Typography variant="h3" fontStyle="normal" fontWeight="400" textTransform="none" component="span">
              {profile?.school.verbose_name}
            </Typography>
          </Stack>
          <Stack direction={'row'} gap={1}>
            <Typography variant="h3" component="span">
              Ročník
            </Typography>
            <Typography variant="h3" fontStyle="normal" fontWeight="400" textTransform="none" component="span">
              {profile?.grade_name}
            </Typography>
          </Stack>
        </Stack>
      </Dialog>

      <Dialog open={displayLoginDialog} close={closeLoginDialog} title="Prihlásenie">
        <Stack alignItems={'center'} gap={3}>
          <Typography variant="body1">Pre odovzdanie sa prihlás.</Typography>
          <LoginForm closeDialog={closeLoginDialog} />
        </Stack>
      </Dialog>

      <Stack gap={5}>
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
          <Stack direction="row" flexWrap="wrap">
            <Typography variant="body1" display="inline-flex" mr={0.5}>
              Ak si nevieš poradiť s niektorou z úloh, pozri si
            </Typography>
            <InlineLink href={`/${seminar}/ako-riesit`}>pár tipov</InlineLink>.
          </Stack>
          {isAfterDeadline ? (
            <Link variant="button2" href={resultsLink}>
              Poradie
            </Link>
          ) : (
            <Link variant="button2" href={rulesLink}>
              Pravidlá
            </Link>
          )}
        </Stack>
        {(loading.semesterListIsLoading ||
          loading.currentSeriesIsLoading ||
          seriesIsLoading ||
          permissionsIsLoading) && <Loading />}
        {hasPermissions && (
          <Stack alignSelf="end">
            <Link href={`/${seminar}/admin/opravovanie/${id.semesterId}`} variant="button2">
              Admin: Opravovanie
            </Link>
          </Stack>
        )}
        {problems.map((problem) => (
          <Problem
            key={problem.id}
            seminar={seminar}
            problem={problem}
            openDiscussion={openDiscussion}
            registered={isRegistered}
            canRegister={canRegister}
            canSubmit={problem.submitted ? canResubmit : canSubmit}
            canCorrect={hasPermissions}
            isAfterDeadline={isAfterDeadline}
            invalidateSeriesQuery={invalidateSeriesQuery}
            displayRegisterDialog={() => setDisplayRegisterDialog(true)}
            displayLoginDialog={() => setDisplayLoginDialog(true)}
          />
        ))}
      </Stack>
      <Dialog open={discussionOpen} close={closeDiscussion} title={`Diskusia - úloha ${discussionProblem?.order}`}>
        <Discussion problemId={discussionProblem?.id} invalidateSeriesQuery={invalidateSeriesQuery} />
      </Dialog>
    </>
  )
}

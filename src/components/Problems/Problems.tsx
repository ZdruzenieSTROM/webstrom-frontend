import {Stack, Typography} from '@mui/material'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'
import {useInterval} from 'usehooks-ts'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {SeriesWithProblems} from '@/types/api/competition'
import {Profile} from '@/types/api/personal'
import {AuthContainer} from '@/utils/AuthContainer'
import {BannerContainer} from '@/utils/BannerContainer'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Dialog} from '../Dialog/Dialog'
import {Loading} from '../Loading/Loading'
import {LoginForm} from '../PageLayout/LoginForm/LoginForm'
import {Discussion} from './Discussion'
import {Problem} from './Problem'
import styles from './Problems.module.scss'

export const Problems: FC = () => {
  const {id, seminar, loading} = useDataFromURL()

  const router = useRouter()

  const {isAuthed} = AuthContainer.useContainer()
  const {setBannerMessages} = BannerContainer.useContainer()

  const {data} = useQuery({
    queryKey: ['personal', 'profiles', 'myprofile'],
    queryFn: () => axios.get<Profile>(`/api/personal/profiles/myprofile`),
    enabled: isAuthed,
  })
  const profile = data?.data

  // used to display discussions
  const [displaySideContent, setDisplaySideContent] = useState<{
    type: string
    problemId: number
    problemNumber: number
    problemSubmitted?: boolean
  }>({type: '', problemId: -1, problemNumber: -1, problemSubmitted: false})

  const {data: seriesData, isLoading: seriesIsLoading} = useQuery({
    queryKey: ['competition', 'series', id.seriesId],
    queryFn: () => axios.get<SeriesWithProblems>(`/api/competition/series/${id.seriesId}`),
    enabled: id.seriesId !== -1,
  })

  const {data: bannerMessage, isLoading: isBannerLoading} = useQuery({
    queryKey: ['cms', 'info-banner', 'series-problems', id.seriesId],
    queryFn: () => axios.get<string[]>(`/api/cms/info-banner/series-problems/${id.seriesId}`),
    enabled: id.seriesId !== -1,
  })

  const bannerMessages = bannerMessage?.data
  const series = seriesData?.data
  const problems = series?.problems ?? []
  const semesterId = series?.semester ?? -1
  const canSubmit = series?.can_submit ?? false
  const canResubmit = series?.can_resubmit ?? false
  const [isAfterDeadline, setIsAfterDeadline] = useState<boolean>(new Date(series?.deadline ?? '') < new Date())

  useInterval(
    () => {
      const isAfterDeadlineNew = new Date(series?.deadline ?? '') < new Date()
      isAfterDeadlineNew !== isAfterDeadline && setIsAfterDeadline(isAfterDeadlineNew)
    },
    // Delay to null to stop it after deadline
    isAfterDeadline ? null : 500,
  )

  const canRegister = series?.can_participate ?? false
  const isRegistered = series?.is_registered ?? false

  const queryClient = useQueryClient()

  const invalidateSeriesQuery = () => queryClient.invalidateQueries({queryKey: ['competition', 'series', id.seriesId]})

  useEffect(() => {
    if (isBannerLoading || bannerMessages === undefined) setBannerMessages([])
    else setBannerMessages(bannerMessages)
  }, [setBannerMessages, isBannerLoading, bannerMessages])

  const {mutate: registerToSemester} = useMutation({
    mutationFn: (id: number) => axios.post(`/api/competition/event/${id}/register`),
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
    displayRegisterDialog && registerToSemester(semesterId)
    closeRegisterDialog()
  }

  const [displayLoginDialog, setDisplayLoginDialog] = useState<boolean>(false)
  const closeLoginDialog = () => setDisplayLoginDialog(false)

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
        <Typography variant="body1" display="inline-flex">
          Ak si nevieš poradiť s niektorou z úloh, pozri si{' '}
          <Link variant="button2" href={`/${seminar}/ako-riesit`}>
            pár tipov
          </Link>
        </Typography>
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
            problem={problem}
            setDisplaySideContent={setDisplaySideContent}
            registered={isRegistered}
            canRegister={canRegister}
            canSubmit={problem.submitted ? canResubmit : canSubmit}
            isAfterDeadline={isAfterDeadline}
            invalidateSeriesQuery={invalidateSeriesQuery}
            displayRegisterDialog={() => setDisplayRegisterDialog(true)}
            displayLoginDialog={() => setDisplayLoginDialog(true)}
          />
        ))}
      </Stack>
      <div className={styles.sideContainer}>
        {displaySideContent.type === 'discussion' && (
          <Discussion
            problemId={displaySideContent.problemId}
            problemNumber={displaySideContent.problemNumber}
            closeDiscussion={() => setDisplaySideContent({type: '', problemId: -1, problemNumber: -1})}
            invalidateSeriesQuery={invalidateSeriesQuery}
          />
        )}
      </div>
    </>
  )
}

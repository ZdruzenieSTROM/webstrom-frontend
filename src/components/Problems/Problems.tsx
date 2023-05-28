import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {Dispatch, FC, SetStateAction, useEffect, useMemo, useState} from 'react'

import {Button, Link} from '@/components/Clickable/Clickable'
import {Problem, SeriesWithProblems} from '@/types/api/competition'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Latex} from '../Latex/Latex'
import {Loading} from '../Loading/Loading'
import {Discussion} from './Discussion'
import styles from './Problems.module.scss'
import {SemesterList, SemesterPicker} from './SemesterPicker'
import {UploadProblemForm} from './UploadProblemForm'

const Problem: FC<{
  problem: Problem
  setDisplaySideContent: Dispatch<
    SetStateAction<{
      type: string
      problemId: number
      problemNumber: number
      problemSubmitted?: boolean
    }>
  >
  registered: boolean
  canRegister: boolean
  canSubmit: boolean
  invalidateSeriesQuery: () => Promise<void>
}> = ({problem, registered, setDisplaySideContent, canSubmit, invalidateSeriesQuery}) => {
  const handleDiscussionButtonClick = () => {
    setDisplaySideContent((prevState) => {
      if (prevState.type === 'discussion' && prevState.problemId === problem.id) {
        return {type: '', problemId: -1, problemNumber: -1}
      } else {
        return {type: 'discussion', problemId: problem.id, problemNumber: problem.order}
      }
    })
  }
  const handleUploadClick = () => {
    setDisplayProblemUploadForm((prevState) => !prevState)
    setDisplayActions(false)
  }

  const [displayProblemUploadForm, setDisplayProblemUploadForm] = useState<boolean>(false)
  const [displayActions, setDisplayActions] = useState(true)

  return (
    <div className={styles.problem}>
      <h3 className={styles.problemTitle}>{problem.order}. ÚLOHA</h3>
      <Latex>{problem.text}</Latex>
      {displayProblemUploadForm && (
        <UploadProblemForm
          problemId={problem.id}
          setDisplayProblemUploadForm={setDisplayProblemUploadForm}
          // problemNumber={problem.order}
          problemSubmitted={!!problem.submitted}
          invalidateSeriesQuery={invalidateSeriesQuery}
          setDisplayActions={setDisplayActions}
        />
      )}
      {displayActions && (
        <div className={styles.actions}>
          {problem.solution_pdf && <Link href={problem.solution_pdf}>vzorové riešenie</Link>}
          {registered && (
            <>
              <Link href={`/api/competition/problem/${problem.id}/my-solution`} disabled={!problem.submitted}>
                moje riešenie
              </Link>
              <Link
                href={`/api/competition/problem/${problem.id}/corrected-solution`}
                disabled={!problem.submitted?.corrected_solution}
              >
                opravené riešenie{!!problem.submitted?.corrected_solution && ` (${problem.submitted.score || '?'})`}
              </Link>
            </>
          )}
          <Button onClick={handleDiscussionButtonClick}>diskusia ({problem.num_comments}) </Button>
          {registered && (
            <Button onClick={handleUploadClick} disabled={!canSubmit}>
              odovzdať
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

const overrideCycle = (prev: boolean | undefined) => {
  if (prev === undefined) return true
  if (prev === true) return false
  return undefined
}

type ProblemsProps = {
  setPageTitle: (title: string) => void
}

export const Problems: FC<ProblemsProps> = ({setPageTitle}) => {
  const router = useRouter()

  const {seminarId, seminar} = useSeminarInfo()

  // used to display discussions
  const [displaySideContent, setDisplaySideContent] = useState<{
    type: string
    problemId: number
    problemNumber: number
    problemSubmitted?: boolean
  }>({type: '', problemId: -1, problemNumber: -1, problemSubmitted: false})

  const {data: semesterListData, isLoading: semesterListIsLoading} = useQuery({
    queryKey: ['competition', 'semester-list', {competition: seminarId}],
    queryFn: () => axios.get<SemesterList[]>(`/api/competition/semester-list?competition=${seminarId}`),
  })
  // memoized because the array fallback would create new object on each render, which would ruin seriesId memoization as semesterList is a dependency
  const semesterList = useMemo(() => semesterListData?.data || [], [semesterListData])

  // z tejto query sa vyuziva len `currentSeriesId` a len vtedy, ked nemame uplnu URL
  // - napr. prideme na `/zadania` cez menu, nie na `/zadania/44/leto/2`
  const {data: currentSeriesData, isLoading: currentSeriesIsLoading} = useQuery({
    queryKey: ['competition', 'series', 'current', seminarId],
    queryFn: () => axios.get<SeriesWithProblems>(`/api/competition/series/current/` + seminarId),
  })
  const currentSeriesId = currentSeriesData?.data.id ?? -1

  // Set seriesId from url.
  // If series is not specified, set seriesId.semester to true and find semester id using year and semesterCode from the url.
  // If series is specified, set seriesId.semester to false and find series id using year, semesterCode, and series number from the url.
  const seriesId = useMemo(() => {
    if (!semesterList.length) return -1

    const {params} = router.query

    const getIdFromUrl = (params: string | string[] | undefined): number => {
      if (params === undefined || params.length === 0 || params.length === 1) {
        return currentSeriesId
      }

      // get year from the first URL param
      const seriesYear = getNumber(params[0])

      // get season from the second URL param
      let seasonCode = -1
      if (params[1] === 'zima') seasonCode = 0
      if (params[1] === 'leto') seasonCode = 1

      const semester = semesterList.find(({year, season_code}) => year === seriesYear && season_code === seasonCode)

      if (semester) {
        if (params.length === 2) {
          if (semester.series_set.length > 0) {
            return semester.series_set[0].id
          }
        }

        if (params.length >= 3) {
          // get series from the second URL param
          const seriesOrder = getNumber(params[2])
          const series = semester.series_set.find(({order}) => order === seriesOrder)

          if (series) return series.id
        }
      }

      return currentSeriesId
    }

    return getIdFromUrl(params)
  }, [router.query, semesterList, currentSeriesId])

  // Update site title if seriesId changes
  useEffect(() => {
    if (!semesterList.length) return

    for (const semester of semesterList) {
      const series = semester.series_set.find(({id}) => id === seriesId)

      if (series) {
        setPageTitle(
          `${semester.year}. ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester${
            series.order ? ` - ${series.order}. séria` : ''
          }`,
        )
        return
      }
    }
  }, [seriesId, semesterList, setPageTitle])

  const {data: seriesData, isLoading: seriesIsLoading} = useQuery({
    queryKey: ['competition', 'series', seriesId],
    queryFn: () => axios.get<SeriesWithProblems>(`/api/competition/series/${seriesId}`),
    enabled: seriesId !== -1,
  })
  const series = seriesData?.data
  const problems = series?.problems ?? []
  const semesterId = series?.semester ?? -1
  const canSubmit = series?.can_submit ?? false

  const [overrideCanRegister, setOverrideCanRegister] = useState<boolean>()
  const [overrideIsRegistered, setOverrideIsRegistered] = useState<boolean>()
  const toggleCanRegister = () => setOverrideCanRegister((prevState) => overrideCycle(prevState))
  const toggleIsRegistered = () => setOverrideIsRegistered((prevState) => overrideCycle(prevState))

  const canRegister = overrideCanRegister ?? series?.can_participate ?? false
  const isRegistered = overrideIsRegistered ?? series?.is_registered ?? false

  const queryClient = useQueryClient()

  const invalidateSeriesQuery = () => queryClient.invalidateQueries({queryKey: ['competition', 'series', seriesId]})

  const {mutate: registerToSemester} = useMutation({
    mutationFn: (id: number) => axios.post(`/api/competition/event/${id}/register`),
    onSuccess: () => {
      // refetch semestra, nech sa aktualizuje is_registered
      invalidateSeriesQuery()
    },
  })

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  return (
    <>
      <div className={styles.container}>
        {(semesterListIsLoading || currentSeriesIsLoading || seriesIsLoading || permissionsIsLoading) && <Loading />}
        <SemesterPicker semesterList={semesterList} selectedSeriesId={seriesId} />
        {hasPermissions && (
          <div className={styles.adminSection}>
            <Link href={`/${seminar}/admin/opravovanie/${semesterId}`}>Admin: Opravovanie</Link>
          </div>
        )}
        {problems.map((problem) => (
          <Problem
            key={problem.id}
            problem={problem}
            setDisplaySideContent={setDisplaySideContent}
            registered={isRegistered}
            canRegister={canRegister}
            canSubmit={canSubmit}
            invalidateSeriesQuery={invalidateSeriesQuery}
          />
        ))}

        {/* TODO: odstranit z produkcie */}
        <div className={styles.debug}>
          <span>debug sekcia:</span>
          <div>
            <Button onClick={toggleIsRegistered}>Override isRegistered:</Button>
            <span style={{color: '#A00', fontWeight: 600}}>
              {' '}
              {overrideIsRegistered === undefined ? 'no override' : overrideIsRegistered ? 'on' : 'off'}
            </span>
          </div>
          <div>
            <Button onClick={toggleCanRegister}>Override canRegister:</Button>
            <span style={{color: '#A00', fontWeight: 600}}>
              {' '}
              {overrideCanRegister === undefined ? 'no override' : overrideCanRegister ? 'on' : 'off'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.sideContainer}>
        {!isRegistered && canRegister ? (
          <div onClick={() => registerToSemester(semesterId)} className={styles.registerButton}>
            Chcem riešiť!
          </div>
        ) : (
          // sideCointainer grid rata s tymto childom, aj ked prazdnym
          <div />
        )}
        {displaySideContent.type === 'discussion' && (
          <Discussion
            problemId={displaySideContent.problemId}
            problemNumber={displaySideContent.problemNumber}
            closeDiscussion={() => setDisplaySideContent({type: '', problemId: -1, problemNumber: -1})}
          />
        )}
        {/* {displaySideContent.type === 'uploadProblemForm' && (
          <UploadProblemForm
            problemId={displaySideContent.problemId}
            problemNumber={displaySideContent.problemNumber}
            problemSubmitted={displaySideContent.problemSubmitted}
            setDisplaySideContent={setDisplaySideContent}
            invalidateSeriesQuery={invalidateSeriesQuery}
          />
        )} */}
      </div>
    </>
  )
}

const getNumber = (n: string) => {
  if (Number.isNaN(Number(n))) {
    return -1
  } else {
    return Number(n) ?? -1
  }
}

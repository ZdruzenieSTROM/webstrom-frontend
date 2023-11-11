import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import {Dispatch, FC, SetStateAction, useState} from 'react'

import {Button, Link} from '@/components/Clickable/Clickable'
import {Problem, SeriesWithProblems} from '@/types/api/competition'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Latex} from '../Latex/Latex'
import {Loading} from '../Loading/Loading'
import {Discussion} from './Discussion'
import styles from './Problems.module.scss'
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
      {problem.image && (
        <div className={styles.imageContainer}>
          <Image
            src={problem.image}
            alt={`Obrázok - ${problem.order} úloha`}
            className={styles.image}
            width={800} // These values are overwritten by css
            height={800}
          />
        </div>
      )}
      {displayProblemUploadForm && (
        <UploadProblemForm
          problemId={problem.id}
          setDisplayProblemUploadForm={setDisplayProblemUploadForm}
          problemSubmitted={!!problem.submitted}
          invalidateSeriesQuery={invalidateSeriesQuery}
          setDisplayActions={setDisplayActions}
        />
      )}
      {displayActions && (
        <div className={styles.actions}>
          {problem.solution_pdf && (
            <Link href={problem.solution_pdf} target="_blank">
              vzorové riešenie
            </Link>
          )}
          {registered && (
            <>
              <Link
                href={`/api/competition/problem/${problem.id}/my-solution`}
                target="_blank"
                disabled={!problem.submitted}
              >
                moje riešenie
              </Link>
              <Link
                href={`/api/competition/problem/${problem.id}/corrected-solution`}
                target="_blank"
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

export const Problems: FC = () => {
  const {id, seminar, loading} = useDataFromURL()

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
  const series = seriesData?.data
  const problems = series?.problems ?? []
  // const semesterId = series?.semester ?? -1
  const canSubmit = series?.can_submit ?? false

  const [overrideCanRegister, setOverrideCanRegister] = useState<boolean>()
  const [overrideIsRegistered, setOverrideIsRegistered] = useState<boolean>()
  const toggleCanRegister = () => setOverrideCanRegister((prevState) => overrideCycle(prevState))
  const toggleIsRegistered = () => setOverrideIsRegistered((prevState) => overrideCycle(prevState))

  const canRegister = overrideCanRegister ?? series?.can_participate ?? false
  const isRegistered = overrideIsRegistered ?? series?.is_registered ?? false

  const queryClient = useQueryClient()

  const invalidateSeriesQuery = () => queryClient.invalidateQueries({queryKey: ['competition', 'series', id.seriesId]})

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
        {(loading.semesterListIsLoading ||
          loading.currentSeriesIsLoading ||
          seriesIsLoading ||
          permissionsIsLoading) && <Loading />}
        {hasPermissions && (
          <div className={styles.adminSection}>
            <Link href={`/${seminar}/admin/opravovanie/${id.semesterId}`}>Admin: Opravovanie</Link>
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

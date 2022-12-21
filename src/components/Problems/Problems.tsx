import {CircularProgress} from '@mui/material'
import axios, {AxiosError} from 'axios'
import {useRouter} from 'next/router'
import {Dispatch, FC, SetStateAction, useEffect, useMemo, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {useQuery} from 'react-query'

import {Button, Link} from '@/components/Clickable/Clickable'
import {Solution} from '@/types/api/generated/competition'
import {AuthContainer} from '@/utils/AuthContainer'
import {niceBytes} from '@/utils/niceBytes'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Latex} from '../Latex/Latex'
import {Discussion} from './Discussion'
import {Dropdown, DropdownOption} from './Dropdown'
import styles from './Problems.module.scss'
import {SideContainer} from './SideContainer'

interface SeriesList {
  id: number
  order: number
  deadline: string
  complete: boolean
  frozen_results: string | null
  semester: number
}

interface SemesterList {
  id: number
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  frozen_results: boolean
  competition: number
  late_tags: string[]
  series_set: SeriesList[]
}

interface Problem {
  id: number
  text: string
  order: number
  series: number
  submitted: Solution
}

interface Series {
  can_participate: boolean
  is_registered: boolean // ToDo: is_registered should be negated !is_registered - api mistake
  can_submit: boolean
  id: number
  problems: Problem[]
  order: number
  deadline: string
  complete: boolean
  frozen_results: string
  semester: number
}

const Problem: FC<{
  problem: Problem
  registered: boolean
  commentCount: number
  setDisplaySideContent: Dispatch<
    SetStateAction<{
      type: string
      problemId: number
      problemNumber: number
    }>
  >
  canRegister: boolean
  canSubmit: boolean
}> = ({problem, registered, commentCount, setDisplaySideContent, canRegister, canSubmit}) => {
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
    if (registered) {
      setDisplaySideContent((prevState) => {
        if (prevState.type === 'uploadProblemForm' && prevState.problemId === problem.id) {
          return {type: '', problemId: -1, problemNumber: -1}
        } else {
          return {type: 'uploadProblemForm', problemId: problem.id, problemNumber: problem.order}
        }
      })
    } else {
      alert('Najprv sa zaregistruj do série klikom na CHCEM RIEŠIŤ.')
    }
  }
  return (
    <div className={styles.problem}>
      <h3 className={styles.problemTitle}>{problem.order}. ÚLOHA</h3>
      <Latex>{problem.text}</Latex>
      <div className={styles.actions}>
        {registered ? <Link href={`/api/competition/problem/${problem.id}/my-solution/`}>moje riešenie</Link> : <></>}
        {registered ? (
          <Link href={`/api/competition/problem/${problem.id}/corrected-solution/`}>
            opravené riešenie ({problem.submitted?.score || '?'})
          </Link>
        ) : (
          <></>
        )}
        <Button onClick={handleDiscussionButtonClick}>
          diskusia ({commentCount === undefined ? 0 : commentCount}){' '}
        </Button>
        {registered || canRegister ? (
          <Button onClick={handleUploadClick} disabled={!canSubmit}>
            odovzdať
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

type ProblemsProps = {
  setPageTitle: (title: string) => void
}

export const Problems: FC<ProblemsProps> = ({setPageTitle}) => {
  const router = useRouter()

  const {isAuthed} = AuthContainer.useContainer()

  const {seminarId} = useSeminarInfo()

  const [displaySideContent, setDisplaySideContent] = useState({type: '', problemId: -1, problemNumber: -1}) // todo: use to display discussions and file upload boxes
  const [commentCount, setCommentCount] = useState<number[]>([]) // ToDo: implement it somehow, probably need some api point for that?

  const {data: semesterListData, isLoading: semesterListIsLoading} = useQuery(
    ['competition', 'semester-list', {competition: seminarId}],
    () => axios.get<SemesterList[]>(`/api/competition/semester-list?competition=${seminarId}`),
  )
  // memoized because the array fallback would create new object on each render, which would ruin seriesId memoization as semesterList is a dependency
  const semesterList = useMemo(() => semesterListData?.data || [], [semesterListData])

  const {data: currentSeriesData, isLoading: currentSeriesIsLoading} = useQuery(
    ['competition', 'series', 'current', seminarId],
    () => axios.get<Series>(`/api/competition/series/current/` + seminarId),
  )
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

  const [overrideCanRegister, setOverrideCanRegister] = useState(false)
  const [overrideIsRegistered, setOverrideIsRegistered] = useState(false)

  useEffect(() => {
    // TODO: refetch competition/series/ID/ - vracia to ine data pre prihlaseneho usera
  }, [isAuthed])

  const {data: seriesData, isLoading: seriesIsLoading} = useQuery(
    ['competition', 'series', seriesId],
    () => axios.get<Series>(`/api/competition/series/${seriesId}`),
    {enabled: seriesId !== -1},
  )
  const series = seriesData?.data
  const problems = series?.problems ?? []
  const semesterId = series?.semester ?? -1
  const canSubmit = series?.can_submit ?? false

  const canRegister = (overrideCanRegister || (series?.can_participate && series?.can_submit)) ?? false
  const isRegistered = (overrideIsRegistered || series?.is_registered) ?? false

  const handleRegistrationToSemester = async (id: number) => {
    // ToDo: check user details and use the following request to register the user to semester.
    try {
      await axios.post(`/api/competition/event/${id}/register`)
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      console.log('Error while registering to semester: ', error)
    }
    setOverrideIsRegistered(true)
  }

  return (
    <>
      <div className={styles.container}>
        {(semesterListIsLoading || currentSeriesIsLoading || seriesIsLoading) && (
          <div className={styles.loading}>
            <CircularProgress color="inherit" />
          </div>
        )}
        <Menu semesterList={semesterList} selectedSeriesId={seriesId} />
        {problems.map((problem) => (
          <Problem
            key={problem.id}
            problem={problem}
            registered={isRegistered}
            commentCount={commentCount[problem.id]}
            setDisplaySideContent={setDisplaySideContent}
            canRegister={canRegister}
            canSubmit={canSubmit}
          />
        ))}
        <div className={styles.actions}>
          debug row:
          <Button onClick={() => setOverrideIsRegistered((prevState) => !prevState)}>
            Toggle registered: <span style={{color: '#A00'}}>{isRegistered ? 'true' : 'false'}</span>
          </Button>
          <Button onClick={() => setOverrideCanRegister((prevState) => !prevState)}>
            Toggle canRegister: <span style={{color: '#A00'}}>{canRegister ? 'true' : 'false'}</span>
          </Button>
        </div>
      </div>

      <div className={styles.sideContainer}>
        {!isRegistered && canRegister ? (
          <div onClick={() => handleRegistrationToSemester(semesterId)} className={styles.registerButton}>
            Chcem riešiť!
          </div>
        ) : (
          // sideCointainer grid rata s tymto childom, aj ked prazdnym
          <div />
        )}
        {displaySideContent.type === 'discussion' && (
          <Discussion problemId={displaySideContent.problemId} problemNumber={displaySideContent.problemNumber} />
        )}
        {displaySideContent.type === 'uploadProblemForm' && (
          <UploadProblemForm
            problemId={displaySideContent.problemId}
            problemNumber={displaySideContent.problemNumber}
            setDisplaySideContent={setDisplaySideContent}
          />
        )}
      </div>
    </>
  )
}

const UploadProblemForm: FC<{
  problemId: number
  problemNumber: number
  setDisplaySideContent: Dispatch<
    SetStateAction<{
      type: string
      problemId: number
      problemNumber: number
    }>
  >
}> = ({problemId, problemNumber, setDisplaySideContent}) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    try {
      const response = await axios.post(`/api/competition/problem/${problemId}/upload-solution/`, formData)
      if (response.status === 201) {
        setDisplaySideContent({type: '', problemId: -1, problemNumber: -1})
        console.log('file uploaded') // ToDo: remove log() and let user know the response! message system? or something else?
        // TODO: ked sa uploadne, tak button "moje riesenie" je stale sivy, lebo nie su natahane `problems` znova. asi nejaky hook(?)
      }
    } catch (e: unknown) {
      console.log(e)
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      alert(error)
    }
  }

  return (
    <SideContainer title={'Odovzdať úlohu - ' + problemNumber}>
      <div {...getRootProps({className: styles.dropzone})}>
        <input {...getInputProps()} />
        <p>DROP pdf</p>
      </div>
      <aside>
        <h4>Files</h4>
        {acceptedFiles[0]?.name && (
          <span>
            {acceptedFiles[0].name} ({niceBytes(acceptedFiles[0].size)})
          </span>
        )}
      </aside>
      <div className={styles.actions} style={{padding: '5px'}}>
        <Button onClick={handleSubmit}>Odovzdať</Button>
      </div>
    </SideContainer>
  )
}

const Menu: FC<{semesterList: SemesterList[]; selectedSeriesId: number}> = ({semesterList, selectedSeriesId}) => {
  const {seminar} = useSeminarInfo()

  let selectedSemesterId = -1

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${seminar}/zadania/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/`,
    }
  })

  let dropdownSeriesList: DropdownOption[] = []

  for (let i = 0; i < semesterList.length; i++) {
    for (let j = 0; j < semesterList[i].series_set.length; j++) {
      if (semesterList[i].series_set[j].id === selectedSeriesId) {
        selectedSemesterId = semesterList[i].id
        dropdownSeriesList = semesterList[i].series_set.map((series) => {
          return {
            id: series.id,
            text: `${series.order}. séria`,
            link: `/${seminar}/zadania/${semesterList[i].year}/${semesterList[i].season_code === 0 ? 'zima' : 'leto'}/${
              series.order
            }/`,
          }
        })
      }
    }
  }

  return (
    <div className={styles.menu}>
      <Dropdown title={'Séria'} selectedId={selectedSeriesId} options={dropdownSeriesList} />
      <Dropdown title={'Semester'} selectedId={selectedSemesterId} options={dropdownSemesterList} />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNumber = (n: any) => {
  if (Number.isNaN(Number(n))) {
    return -1
  } else {
    return Number(n) ?? -1
  }
}

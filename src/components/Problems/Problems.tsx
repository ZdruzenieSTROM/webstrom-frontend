import axios, {AxiosError} from 'axios'
import {useRouter} from 'next/router'
import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'

import {Button, Link} from '@/components/Clickable/Clickable'
import {Solution} from '@/types/api/generated/competition'
import {AuthContainer} from '@/utils/AuthContainer'
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
  // ToDo: initial state false + set value after API update
  const [canRegister, setCanRegister] = useState(true)
  // ToDo: initial state false + set value after API update
  const [registered, setRegistered] = useState(false)
  const {seminarId} = useSeminarInfo()
  const [canSubmit, setCanSubmit] = useState(false)

  // List of semesters with their ids and series belonging to them
  const [semesterList, setSemesterList] = useState<SemesterList[]>([])

  // Id of results to be fetched
  const [problemsId, setProblemsId] = useState({semester: true, id: -1})

  // Id of the current semester
  const [currentSeriesId, setCurrentSeriesId] = useState(-1)

  const [problems, setProblems] = useState<Problem[]>([])
  const [semesterId, setSemesterId] = useState(-1)

  const [displaySideContent, setDisplaySideContent] = useState({type: '', problemId: -1, problemNumber: -1}) // todo: use to display discussions and file upload boxes
  const [commentCount, setCommentCount] = useState<number[]>([]) // ToDo: implement it somehow, probably need some api point for that?

  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars

  // Fetch list of semesters from the api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<SemesterList[]>(`/api/competition/semester-list/?competition=${seminarId}`)
        setSemesterList(data)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [seminarId])

  // Set problemsId from url.
  // If series is not specified, set semesterId.semester to true and find semester id using year and semesterCode from the url.
  // If series is specifies, set semesterId.semester to false and find series id using year, semesterCode, and series number from the url.

  useEffect(() => {
    const {params} = router.query

    const getIdFromUrl = (params: string | string[] | undefined): {semester: boolean; id: number} => {
      if (params === undefined || params?.length === 0 || params?.length === 1) {
        return {semester: false, id: currentSeriesId}
      }
      if (params?.length === 2) {
        const year = getNumber(params[0])
        let seasonCode = -1
        let id = -1

        if (params[1] === 'zima') {
          seasonCode = 0
        }
        if (params[1] === 'leto') {
          seasonCode = 1
        }

        for (let i = 0; i < semesterList.length; i++) {
          if (semesterList[i].year === year && semesterList[i].season_code === seasonCode) {
            if (semesterList[i].series_set.length > 0) {
              id = semesterList[i].series_set[0].id
            }
          }
        }

        if (id === -1) {
          return {semester: false, id: currentSeriesId}
        } else {
          return {semester: false, id: id}
        }
      }
      if (params?.length >= 3) {
        const year = getNumber(params[0])
        let seasonCode = -1
        let id = -1

        if (params[1] === 'zima') {
          seasonCode = 0
        }
        if (params[1] === 'leto') {
          seasonCode = 1
        }

        for (let i = 0; i < semesterList.length; i++) {
          if (semesterList[i].year === year && semesterList[i].season_code === seasonCode) {
            const order = getNumber(params[2])
            for (let j = 0; j < semesterList[i].series_set.length; j++) {
              if (semesterList[i].series_set[j].order === order) {
                id = semesterList[i].series_set[j].id
              }
            }
          }
        }

        if (id === -1) {
          return {semester: false, id: currentSeriesId}
        } else {
          return {semester: false, id: id}
        }
      }

      return {semester: false, id: currentSeriesId}
    }

    setProblemsId(getIdFromUrl(params))
  }, [router.query, semesterList, currentSeriesId])

  // Set currentSeriesId from competition/semester/current/seminarId/ api point
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Series>(`/api/competition/series/current/` + seminarId)
        setCurrentSeriesId(data.id)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [seminarId])

  // Update site title if resultsId changes
  useEffect(() => {
    let title = ''

    for (let i = 0; i < semesterList.length; i++) {
      if (problemsId.semester === true) {
        if (problemsId.id === semesterList[i].id) {
          title =
            '' +
            semesterList[i].year +
            '. ročník - ' +
            (semesterList[i].season_code === 0 ? 'zimný' : 'letný') +
            ' semester'
        }
      } else {
        for (let j = 0; j < semesterList[i].series_set.length; j++) {
          if (problemsId.id === semesterList[i].series_set[j].id) {
            title =
              '' +
              semesterList[i].year +
              '. ročník - ' +
              (semesterList[i].season_code === 0 ? 'zimný' : 'letný') +
              ' semester - ' +
              semesterList[i].series_set[j].order +
              '. séria'
          }
        }
      }
    }

    setPageTitle(title)
  }, [problemsId, semesterList, setPageTitle])

  // Fetch problems from the api using series id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Series>('/api/competition/series/' + problemsId.id + '/')
        setProblems(data.problems)
        setSemesterId(data.semester)
        setCanSubmit(data.can_submit)

        if (data.can_participate === null) {
          setCanRegister(false)
        } else {
          setCanRegister(data.can_participate)
        }
        if (data.is_registered === null) {
          setRegistered(false)
        } else {
          setRegistered(data.is_registered)
        }
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    if (problemsId.id !== -1 && problemsId.semester === false) {
      fetchData()
    } else {
      setProblems([])
    }
    // zbehni znovu ked sa isAuthed zmeni - competition/series/ID/ vracia ine data pre prihlaseneho usera
  }, [problemsId, isAuthed])

  const handleRegistrationToSemester = async (id: number) => {
    // ToDo: check user details and use the following request to register the user to semester.
    try {
      await axios.post(`/api/competition/event/${id}/register`)
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      console.log('Error while registering to semester: ', error)
    }
    setRegistered(true)
  }

  return (
    <>
      <div className={styles.container}>
        <Menu semesterList={semesterList} selectedId={problemsId} />
        {problems.map((problem) => (
          <Problem
            key={problem.id}
            problem={problem}
            registered={registered}
            commentCount={commentCount[problem.id]}
            setDisplaySideContent={setDisplaySideContent}
            canRegister={canRegister}
            canSubmit={canSubmit}
          />
        ))}
        <div className={styles.actions}>
          debug row:
          <Button
            onClick={() => {
              setRegistered((prevState) => {
                return !prevState
              })
            }}
          >
            Toggle registered: <span style={{color: '#A00'}}>{registered ? 'true' : 'false'}</span>
          </Button>
          <Button
            onClick={() => {
              setCanRegister((prevState) => {
                return !prevState
              })
            }}
          >
            Toggle canRegister: <span style={{color: '#A00'}}>{canRegister ? 'true' : 'false'}</span>
          </Button>
        </div>
      </div>

      <div className={styles.sideContainer}>
        {!registered && canRegister && (
          <div
            onClick={() => {
              handleRegistrationToSemester(semesterId)
            }}
            className={styles.registerButton}
          >
            Chcem riešiť!
          </div>
        )}
        {(registered || !canRegister) && <div />}
        {displaySideContent.type === 'discussion' && (
          <Discussion problemId={displaySideContent.problemId} problemNumber={displaySideContent.problemNumber} />
        )}
        {displaySideContent.type === 'uploadProblemForm' && (
          <UploadProblemForm
            problemId={displaySideContent.problemId}
            problemNumber={displaySideContent.problemNumber}
          />
        )}
      </div>
    </>
  )
}

const UploadProblemForm: FC<{problemId: number; problemNumber: number}> = ({problemId, problemNumber}) => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone()

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    try {
      const response = await axios.post(`/api/competition/problem/${problemId}/upload-solution/`, formData)
      if (response.status === 201) {
        console.log('file uploaded') // ToDo: remove log() and let user know the response! message system? or something else?
      }
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
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
            {acceptedFiles[0].name} - {acceptedFiles[0].size} bytes
          </span>
        )}
      </aside>
      <div className={styles.actions} style={{padding: '5px'}}>
        <Button onClick={handleSubmit}>Odovzdať</Button>
      </div>
    </SideContainer>
  )

  // return UploadProblemForm - {problemNumber}
}

const Menu: FC<{semesterList: SemesterList[]; selectedId: {semester: boolean; id: number}}> = ({
  semesterList,
  selectedId,
}) => {
  const {seminar} = useSeminarInfo()

  let selectedSemesterId = -1
  let selectedSeriesId = -1

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${seminar}/zadania/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/`,
    }
  })

  let dropdownSeriesList: DropdownOption[] = []

  for (let i = 0; i < semesterList.length; i++) {
    if (selectedId.semester === true && selectedId.id === semesterList[i].id) {
      selectedSemesterId = selectedId.id
      dropdownSeriesList = semesterList[i].series_set.map((series) => {
        return {
          id: series.id,
          text: `${series.order}. séria`,
          link: `/${seminar}/zadania/${semesterList[i].year}/${semesterList[i].season_code === 0 ? 'zima' : 'leto'}/${
            series.order
          }/`,
        }
      })
    } else if (selectedId.semester === false) {
      for (let j = 0; j < semesterList[i].series_set.length; j++) {
        if (semesterList[i].series_set[j].id === selectedId.id) {
          selectedSemesterId = semesterList[i].id
          selectedSeriesId = selectedId.id
          dropdownSeriesList = semesterList[i].series_set.map((series) => {
            return {
              id: series.id,
              text: `${series.order}. séria`,
              link: `/${seminar}/zadania/${semesterList[i].year}/${
                semesterList[i].season_code === 0 ? 'zima' : 'leto'
              }/${series.order}/`,
            }
          })
        }
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

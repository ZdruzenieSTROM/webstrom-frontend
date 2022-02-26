import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Dispatch, FC, Fragment, MouseEvent, SetStateAction, useEffect, useState} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Latex} from '../Latex/Latex'
import styles from './Problems.module.scss'

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
}

interface Series {
  id: number
  problems: Problem[]
  order: number
  deadline: string
  complete: boolean
  frozen_results: string
  semester: number
}

// interface Semester {
//   id: number
//   series_set: Series[]
//   semesterpublication_set: string[]
//   unspecifiedpublication_set: string[]
//   year: number
//   school_year: string
//   season_code: number
//   start: string
//   end: string
//   frozen_results: string
//   competition: number
//   late_tags: string[]
// }

interface DiscussionProps {
  problemId: number
  problemNumber: number
  display: boolean
  setCommentCount: Dispatch<SetStateAction<number[]>>
}

interface Comments {
  id: number
  text: string
  posted_at: string
  published: boolean
  problem: number
  posted_by: number
}

interface Comment {
  id: number
  text: string
  published: boolean
  posted_by: number
  name: string
}

interface Profile {
  first_name: string
  last_name: string
  nickname: string
  school: number
  phone: string
  parent_phone: string
  gdpr: boolean
  grade: number
}
// interface CurrentSemester {
//   id: number
//   series_set: SeriesList[]
//   semesterpublication_set: string[]
//   unspecifiedpublication_set: string[]
//   year: number
//   school_year: string
//   season_code: number
//   start: string
//   end: string
//   frozen_results: string
//   competition: number
//   late_tags: string[]
// }
// interfaces for dropdown menus
interface DropdownOption {
  id: number
  text: string
  link: string
}

type ProblemsProps = {
  setPageTitle: (title: string) => void
}

export const Problems: FC<ProblemsProps> = ({setPageTitle}) => {
  const router = useRouter()

  const {seminarId} = useSeminarInfo()

  // List of semesters with their ids and series belonging to them
  const [semesterList, setSemesterList] = useState<SemesterList[]>([])

  // Id of results to be fetched
  const [problemsId, setProblemsId] = useState({semester: true, id: -1})

  // Id of the current semester
  const [currentSeriesId, setCurrentSeriesId] = useState(-1)

  const [problems, setProblems] = useState<Problem[]>([])

  // const [seriesId, setSeriesId] = useState(-1)
  const [displayDiscussionId, setDisplayDiscussionId] = useState(-1)
  const [commentCount, setCommentCount] = useState<number[]>([])

  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars

  // get list of semesters from the api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<SemesterList[]>(`/api/competition/semester-list/?competition=${seminarId}`, {
          headers: {
            'Content-type': 'application/json',
          },
        })
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

  // set currentSeriesId from competition/semester/current/seminarId/ api point
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Series>(`/api/competition/series/current/` + seminarId, {
          headers: {
            'Content-type': 'application/json',
          },
        })
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Series>('/api/competition/series/' + problemsId.id + '/', {
          headers: {
            'Content-type': 'application/json',
          },
        })
        setProblems(data.problems)
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
  }, [problemsId])

  const handleClick = (id: number) => {
    setDisplayDiscussionId((prevDisplayDiscussionId) => {
      if (prevDisplayDiscussionId === id) {
        return -1
      } else {
        return id
      }
    })
  }

  return (
    <div className={styles.container}>
      <Menu seminarId={seminarId} semesterList={semesterList} selectedId={problemsId} />
      {problems.map((problem) => (
        <Fragment key={problem.id}>
          <div className={styles.problem}>
            <h3 className={styles.problemTitle}>{problem.order}. ÚLOHA</h3>
            <Latex>{problem.text}</Latex>
            <div className={styles.actions}>
              <span>ODOVZDAŤ</span>
              <span onClick={() => handleClick(problem.id)}>
                DISKUSIA - {commentCount[problem.order] === undefined ? '0' : commentCount[problem.order]}
              </span>
            </div>
          </div>
          <Discussion
            problemId={problem.id}
            problemNumber={problem.order}
            display={problem.id === displayDiscussionId}
            setCommentCount={setCommentCount}
          />
        </Fragment>
      ))}
    </div>
  )
}

// Whole component needs to be updated!
const Discussion: FC<DiscussionProps> = ({problemId, problemNumber, display, setCommentCount}) => {
  const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [comments, setComments] = useState<Comment[]>([])
  const [names, setNames] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async (problemId: number) => {
      try {
        const {data} = await axios.get<Comments[]>(`/api/competition/problem/${problemId}/comments`, {
          headers: {
            'Content-type': 'application/json',
          },
        })

        const getName = async (id: number) => {
          if (names[id] !== undefined) {
            return names[id]
          } else {
            try {
              const {data} = await axios.get<Profile>(`/api/personal/profiles/${id}/`, {
                headers: {
                  'Content-type': 'application/json',
                },
              })

              setNames((prevNames) => {
                prevNames[id] = data.first_name + ' ' + data.last_name
                return prevNames
              })
              return data.first_name + ' ' + data.last_name
            } catch (e: unknown) {
              const ex = e as AxiosError
              const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
              setError(error)
              return ''
            } finally {
              setLoading(false)
            }
          }
        }

        const comments = data.map((comment) => {
          return {
            id: comment.id,
            text: comment.text,
            published: comment.published,
            posted_by: comment.posted_by,
            name: '',
          }
        })

        comments.forEach(async (comment) => {
          comment.name = await getName(comment.posted_by)
        })

        setCommentCount((prevCommentCount) => {
          prevCommentCount[problemNumber] = comments.length
          return prevCommentCount
        })
        setComments(comments)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData(problemId)
  }, [problemId, names, problemNumber, setCommentCount])

  if (!display) {
    return <></>
  }

  return (
    <div className={styles.discussion}>
      <div className={styles.overlay}></div>
      <div className={styles.discussionBox}>
        <div className={styles.title}>Diskusia - úloha {problemNumber}</div>
        <div className={styles.comments}>
          {comments.map((comment) => {
            return (
              <div className={styles.comment} key={comment.id}>
                <div className={styles.title}>{comment.name}</div>
                <div className={styles.body}>{comment.text}</div>
              </div>
            )
          })}
        </div>
        <div className={styles.textArea}>
          <textarea />
          <button>Odoslať</button>
        </div>
      </div>
    </div>
  )
}

const Menu: FC<{seminarId: number; semesterList: SemesterList[]; selectedId: {semester: boolean; id: number}}> = ({
  seminarId,
  semesterList,
  selectedId,
}) => {
  let selectedSemesterId = -1
  let selectedSeriesId = -1

  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${getSeminarName(seminarId)}/zadania/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}/`,
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
          link: `/${getSeminarName(seminarId)}/zadania/${semesterList[i].year}/${
            semesterList[i].season_code === 0 ? 'zima' : 'leto'
          }/${series.order}/`,
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
              link: `/${getSeminarName(seminarId)}/zadania/${semesterList[i].year}/${
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

const Dropdown: FC<{title: string; selectedId: number; options: DropdownOption[]}> = ({title, selectedId, options}) => {
  const [display, setDisplay] = useState(false)

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    setDisplay((prevDisplay) => {
      return !prevDisplay
    })
  }

  const handleMouseLeave = () => {
    setDisplay(false)
  }

  return (
    <div className={styles.dropdown} onClick={handleClick} onMouseLeave={handleMouseLeave}>
      {title} <div className={styles.arrow}></div>
      <div className={clsx(styles.options, display && styles.displayOptions)}>
        {options.map((option) => {
          return (
            <Link href={option.link} key={option.id}>
              <a>
                <div className={clsx(styles.option, selectedId === option.id && styles.selectedOption)}>
                  {option.text}
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

const getSeminarName = (id: number) => {
  switch (id) {
    case 0:
      return 'strom'
    case 1:
      return 'matik'
    case 2:
      return 'malynar'
    default:
      return ''
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNumber = (n: any) => {
  if (Number.isNaN(Number(n))) {
    return -1
  } else {
    return Number(n) ?? -1
  }
}

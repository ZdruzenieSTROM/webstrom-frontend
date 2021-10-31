import axios, {AxiosError} from 'axios'
import {useRouter} from 'next/router'
import {Dispatch, FC, Fragment, SetStateAction, useEffect, useState} from 'react'

import {Latex} from '../Latex/Latex'
import {getSeminarName} from '../PageLayout/MenuMain/MenuMain'
import styles from './Problems.module.scss'

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
  frozen_results: any
  semester: number
}

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

type ProblemsProps = {}

export const Problems: FC<ProblemsProps> = () => {
  const router = useRouter()

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [seriesId, setSeriesId] = useState(-1)
  const [displayDiscussionId, setDisplayDiscussionId] = useState(-1)
  const [commentCount, setCommentCount] = useState<number[]>([])

  const seminarId = getSeminarId(router.pathname)
  // const seminarName = getSeminarName(seminarId)

  useEffect(() => {
    const newId = getSeriesId(router.query.params)
    if (seriesId !== newId) {
      setSeriesId(newId)
    }
  }, [router.query.params, seriesId])

  useEffect(() => {
    const fetchData = async (seriesId: number) => {
      try {
        const {data} = await axios.get<Series>(`/api/competition/series/${seriesId}/`, {
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
    fetchData(seriesId)
  }, [seriesId])

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

const getSeminarId = (pathname: string) => {
  switch (pathname.slice(1).split('/', 1)[0]) {
    case 'strom':
      return 0
    case 'matik':
      return 1
    case 'malynar':
      return 2
    default:
      return -1
  }
}

const Discussion: FC<DiscussionProps> = ({problemId, problemNumber, display, setCommentCount}) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
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

const getSeriesId = (params: string | string[] | undefined) => {
  // Using path params return the id of the series to be displayed
  return 1
}

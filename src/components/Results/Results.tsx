import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Dispatch, FC, Fragment, MouseEvent, SetStateAction, useEffect, useState} from 'react'

import styles from './Results.module.scss'

interface Registration {
  school: {
    code: number
    name: string
    abbreviation: string
    street: string
    city: string
    zip_code: string
  }
  grade: string
  profile: {
    first_name: string
    last_name: string
    nickname: string
  }
}

interface Result {
  rank_start: number
  rank_end: number
  rank_changed: boolean
  registration: Registration
  subtotal: number[]
  total: number
  solutions: {
    points: string
    solution_pk: number
    problem_pk: number
    votes: number
  }[][]
}

interface Semesters {
  event_set: {
    id: number
    unspecifiedpublication_set: string[]
    registration_links: string[]
    year: number
    school_year: string
    start: string
    end: string
    competition: number
  }[]
  name: string
  start_year: number
  description: string
  rules: string
  competition_type: number
  min_years_until_graduation: number
  sites: number[]
  permission_group: number[]
}

interface Semester {
  id: number
  year: number
  seminar: string
  semester?: 0 | 1
}

export const Results: FC<{seminarId: number; setPageTitle: Dispatch<SetStateAction<string>>}> = ({
  seminarId,
  setPageTitle,
}) => {
  const [results, setResults] = useState<Result[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])

  // delete?
  const [resultsId, setResultsId] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Result[]>(
          `/api/competition/semester/${resultsId === -1 ? 'current-results' : resultsId + '/results/'}`,
          {
            headers: {
              'Content-type': 'application/json',
            },
          },
        )
        setResults(data)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [resultsId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Semesters>(`/api/competition/competition/${seminarId}/`, {
          headers: {
            'Content-type': 'application/json',
          },
        })

        setSemesters(
          data.event_set.map((event) => {
            return {id: event.id, year: event.year, seminar: seminarName(seminarId), semester: 0} // change it after peto changes api endpoint
          }),
        )
        // setResults(data)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Semesters>(`/api/competition/competition/${seminarId}/`, {
          headers: {
            'Content-type': 'application/json',
          },
        })
        data.event_set.forEach((event) => {
          if (event.id === resultsId) {
            setPageTitle(`${event.year}. Ročník - ${event.id === 1 ? 'zimný' : 'letný'} semester`) // change event.id === 1 to event.semester === 0 after peto changes api endpoint
          }
        })
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [resultsId, seminarId, setPageTitle])

  const displayRow = (row: Result, key: number) => {
    let votes_pos = 0
    let votes_neg = 0

    for (const series in row.solutions) {
      const solutions = row.solutions[series]
      for (const solution in solutions) {
        if (solutions[solution].votes > 0) {
          votes_pos += solutions[solution].votes
        } else if (solutions[solution].votes < 0) {
          votes_neg += solutions[solution].votes
        }
      }
    }

    return (
      <div className={styles.rowWrapper} key={key}>
        <div className={styles.rank}>{row.rank_changed && row.rank_start + '.'}</div>
        <div className={styles.nameAndSchool}>
          <div className={styles.name}>
            {row.registration.profile.first_name + ' ' + row.registration.profile.last_name}
          </div>
          <div className={styles.school}>
            {row.registration.school.name + ' ' + row.registration.school.street + ' ' + row.registration.school.city}
          </div>
        </div>
        <div className={styles.grade}>{row.registration.grade}</div>
        <div className={styles.score}>
          {row.solutions.map((series, key) => (
            <div key={key}>
              {series.map((solution, key) => (
                <div key={key}>{solution.points}</div>
              ))}
              <div className={styles.subtotal}>{row.subtotal[key]}</div>
            </div>
          ))}
        </div>
        <div className={styles.totalScore}>{row.total}</div>
        <div className={clsx(styles.votes, votes_neg + votes_pos !== 0 && 'tooltip')}>
          {votes_neg + votes_pos !== 0 && votes_neg + votes_pos}
          {votes_neg + votes_pos !== 0 && <span className="tooltiptext">Hlasy</span>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Menu seminarId={seminarId} />
      <div className={styles.results}>{results.map((row, index) => displayRow(row, index))}</div>
    </div>
  )
}

// interfaces for dropdown menus

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

interface DropdownOptions {
  id: number
  text: string
  link: string
}

const Menu: FC<{seminarId: number}> = ({seminarId}) => {
  const router = useRouter()

  const [semesterList, setSemesterList] = useState<SemesterList[]>([])
  const [dropdownSemesterList, setDropdownSemesterList] = useState<DropdownOptions[]>([])
  const [dropdownSeriesList, setDropdownSeriesList] = useState<DropdownOptions[]>([])
  const [selectedSemesterId, setSelectedSemesterId] = useState(-1)
  const [selectedSeriesId, setSelectedSeriesId] = useState(-1)
  // const [pathToIdMap, setPathToIdMap] = useState({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // get menu items for dropdowns
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

  useEffect(() => {
    setDropdownSemesterList(
      semesterList.map((semester) => {
        return {
          id: semester.id,
          text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
          link: `/${getSeminarName(seminarId)}/vysledky/${semester.year}/${
            semester.season_code === 0 ? 'zima' : 'leto'
          }/`,
        }
      }),
    )
  }, [semesterList, seminarId])

  useEffect(() => {
    let selectedSemester = -1
    let selectedSeries = -1
    semesterList.forEach((semester) => {
      if (router.query.params !== undefined) {
        if (
          getNumber(router.query.params[0]) === semester.year &&
          router.query.params[1] === (semester.season_code === 0 ? 'zima' : 'leto')
        ) {
          selectedSemester = semester.id
          setDropdownSeriesList(
            semester.series_set.map((series) => {
              return {
                id: series.id,
                text: `${series.order} séria`,
                link: `/${getSeminarName(seminarId)}/vysledky/${semester.year}/${
                  semester.season_code === 0 ? 'zima' : 'leto'
                }/${series.order}`,
              }
            }),
          )

          semester.series_set.forEach((series) => {
            if (router.query.params !== undefined) {
              if (getNumber(router.query.params[2]) === series.order) {
                selectedSeries = series.id
              }
            }
          })
        }
      }
    })
    setSelectedSemesterId(selectedSemester)
    setSelectedSeriesId(selectedSeries)
  }, [router.query.params, semesterList])

  return (
    <div className={styles.menu}>
      <Dropdown title={'Séria'} selectedId={selectedSeriesId} options={dropdownSeriesList} />
      <Dropdown title={'Semester'} selectedId={selectedSemesterId} options={dropdownSemesterList} />
    </div>
  )
}

interface Option {
  id: number
  text: string
  link: string
}

const Dropdown: FC<{title: string; selectedId: number; options: Option[]}> = ({title, selectedId, options}) => {
  const [display, setDisplay] = useState(false)

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    setDisplay((prevDisplay) => {
      return !prevDisplay
    })
  }

  return (
    <div className={styles.dropdown} onClick={handleClick}>
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

const getNumber = (n: any) => {
  if (Number.isNaN(Number(n))) {
    return -1
  } else {
    return Number(n) ?? -1
  }
}

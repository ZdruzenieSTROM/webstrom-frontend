import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Dropdown, DropdownOption} from '../Problems/Dropdown'
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

export interface Result {
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

interface CurrentSemester {
  id: number
  series_set: SeriesList[]
  semesterpublication_set: string[]
  unspecifiedpublication_set: string[]
  year: number
  school_year: string
  season_code: number
  start: string
  end: string
  frozen_results: string
  competition: number
  late_tags: string[]
}

type ResultsProps = {
  setPageTitle: (title: string) => void
}

export const Results: FC<ResultsProps> = ({setPageTitle}) => {
  const [results, setResults] = useState<Result[]>([])

  const router = useRouter()

  const {seminarId} = useSeminarInfo()

  // Id of results to be fetched
  const [resultsId, setResultsId] = useState({semester: true, id: -1})

  // Id of the current semester
  const [currentSemesterId, setCurrentSemesterId] = useState(-1)

  // List of semesters with their ids and series belonging to them
  const [semesterList, setSemesterList] = useState<SemesterList[]>([])

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

  // Set resultsId from url.
  // If nothing is specified, use id=-1 for the current semester.
  // If series is not specified, set semesterId.semester to true and find semester id using year and semesterCode from the url.
  // If series is specifies, set semesterId.semester to false and find series id using year, semesterCode, and series number from the url.

  useEffect(() => {
    const {params} = router.query

    const getIdFromUrl = (params: string | string[] | undefined): {semester: boolean; id: number} => {
      if (params === undefined || params?.length === 0 || params?.length === 1) {
        return {semester: true, id: currentSemesterId}
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
            id = semesterList[i].id
          }
        }

        if (id === -1) {
          return {semester: true, id: currentSemesterId}
        } else {
          return {semester: true, id: id}
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
          return {semester: true, id: currentSemesterId}
        } else {
          return {semester: false, id: id}
        }
      }

      return {semester: true, id: currentSemesterId}
    }

    setResultsId(getIdFromUrl(params))
  }, [router.query, semesterList, currentSemesterId])

  // Fetch data either from the semester api point is semesterId.semester is true or from the series api point id semesterId.semester is false. Use semesterId.id to get specific results to display.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<Result[]>(
          '/api/competition/' + (resultsId.semester === true ? 'semester/' : 'series/') + resultsId.id + '/results',
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
    if (resultsId.id !== -1) {
      fetchData()
    } else {
      setResults([])
    }
  }, [resultsId])

  // set currentSemesterId from competition/semester/current/seminarId/ api point
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<CurrentSemester>(`/api/competition/semester/current/` + seminarId, {
          headers: {
            'Content-type': 'application/json',
          },
        })
        setCurrentSemesterId(data.id)
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
      if (resultsId.semester === true) {
        if (resultsId.id === semesterList[i].id) {
          title =
            '' +
            semesterList[i].year +
            '. ročník - ' +
            (semesterList[i].season_code === 0 ? 'zimný' : 'letný') +
            ' semester'
        }
      } else {
        for (let j = 0; j < semesterList[i].series_set.length; j++) {
          if (resultsId.id === semesterList[i].series_set[j].id) {
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
  }, [resultsId, semesterList, setPageTitle])

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
      <Menu semesterList={semesterList} selectedId={resultsId} />
      <div className={styles.results}>{results.map((row, index) => displayRow(row, index))}</div>
    </div>
  )
}

const Menu: FC<{semesterList: SemesterList[]; selectedId: {semester: boolean; id: number}}> = ({
  semesterList,
  selectedId,
}) => {
  const {seminar} = useSeminarInfo()

  let selectedSemesterId = -1
  let selectedSeriesId = -1

  const [loading, setLoading] = useState(true) // eslint-disable-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('') // eslint-disable-line @typescript-eslint/no-unused-vars

  const dropdownSemesterList = semesterList.map((semester) => {
    return {
      id: semester.id,
      text: `${semester.year}. Ročník - ${semester.season_code === 0 ? 'zimný' : 'letný'} semester`,
      link: `/${seminar}/vysledky/${semester.year}/${semester.season_code === 0 ? 'zima' : 'leto'}`,
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
          link: `/${seminar}/vysledky/${semesterList[i].year}/${semesterList[i].season_code === 0 ? 'zima' : 'leto'}/${
            series.order
          }`,
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
              link: `/${seminar}/vysledky/${semesterList[i].year}/${
                semesterList[i].season_code === 0 ? 'zima' : 'leto'
              }/${series.order}`,
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

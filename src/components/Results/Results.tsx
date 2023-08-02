import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'
import {FC} from 'react'

import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {useDataFromURL} from '@/utils/useDataFromURL'

import {Loading} from '../Loading/Loading'
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

export const Results: FC = () => {
  const {id, displayWholeSemesterOnResults, semesterList} = useDataFromURL()

  const {data: resultsData, isLoading: resultsIsLoading} = useQuery({
    queryKey: [
      'competition',
      displayWholeSemesterOnResults ? 'semester/' : 'series/',
      displayWholeSemesterOnResults ? id.semesterId : id.seriesId,
      'results',
    ],
    queryFn: () =>
      axios.get<Result[]>(
        `/api/competition/${displayWholeSemesterOnResults ? 'semester/' : 'series/'}${
          displayWholeSemesterOnResults ? id.semesterId : id.seriesId
        }/results`,
        {headers: {'Content-type': 'application/json'}},
      ),
    enabled: id.semesterId !== -1 || id.seriesId !== -1,
  })
  const results = resultsData?.data ?? []

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
      {resultsIsLoading && <Loading />}
      <SemesterPicker
        semesterList={semesterList}
        selectedItem={{semesterId: id.semesterId, seriesId: id.seriesId}}
        page={'results'}
        displayWholeSemesterOption={displayWholeSemesterOnResults}
      />
      <div className={styles.results}>{results.map((row, index) => displayRow(row, index))}</div>
    </div>
  )
}

import clsx from 'clsx'
import {FC} from 'react'

import styles from './ResultsRow.module.scss'

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

export const ResultsRow: FC<{result: Result}> = ({result}) => {
  let votes_pos = 0
  let votes_neg = 0

  for (const series in result.solutions) {
    const solutions = result.solutions[series]
    for (const solution in solutions) {
      if (solutions[solution].votes > 0) {
        votes_pos += solutions[solution].votes
      } else if (solutions[solution].votes < 0) {
        votes_neg += solutions[solution].votes
      }
    }
  }

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.rank}>{result.rank_changed && result.rank_start + '.'}</div>
      <div className={styles.nameAndSchool}>
        <div className={styles.name}>
          {result.registration.profile.first_name + ' ' + result.registration.profile.last_name}
        </div>
        <div className={styles.school}>
          {result.registration.school.name +
            ' ' +
            result.registration.school.street +
            ' ' +
            result.registration.school.city}
        </div>
      </div>
      <div className={styles.grade}>{result.registration.grade}</div>
      <div className={styles.score}>
        {result.solutions.map((series, key) => (
          <div key={key}>
            {series.map((solution, key) => (
              <div key={key}>{solution.points}</div>
            ))}
            <div className={styles.subtotal}>{result.subtotal[key]}</div>
          </div>
        ))}
      </div>
      <div className={styles.totalScore}>{result.total}</div>
      <div className={clsx(styles.votes, votes_neg + votes_pos !== 0 && 'tooltip')}>
        {votes_neg + votes_pos !== 0 && votes_neg + votes_pos}
        {votes_neg + votes_pos !== 0 && <span className="tooltiptext">Hlasy</span>}
      </div>
    </div>
  )
}

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
  const {solutions, rank_changed, rank_start, registration, subtotal, total} = result

  let votes_pos = 0
  let votes_neg = 0

  for (const seriesSolutions of result.solutions) {
    for (const {votes} of seriesSolutions) {
      if (votes > 0) {
        votes_pos += votes
      } else if (votes < 0) {
        votes_neg += votes
      }
    }
  }

  const votes_total = votes_neg + votes_pos

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.rank}>{rank_changed && rank_start + '.'}</div>
      <div className={styles.nameAndSchool}>
        <div className={styles.name}>{registration.profile.first_name + ' ' + registration.profile.last_name}</div>
        <div className={styles.school}>
          {registration.school.name + ' ' + registration.school.street + ' ' + registration.school.city}
        </div>
      </div>
      <div className={styles.grade}>{registration.grade}</div>
      <div className={styles.score}>
        {solutions.map((series, key) => (
          <div key={key}>
            {series.map((solution, key) => (
              <div key={key}>{solution.points}</div>
            ))}
            <div className={styles.subtotal}>{subtotal[key]}</div>
          </div>
        ))}
      </div>
      <div className={styles.totalScore}>{total}</div>
      <div className={clsx(styles.votes, votes_total !== 0 && 'tooltip')}>
        {votes_total !== 0 && votes_total}
        {votes_total !== 0 && <span className="tooltiptext">Hlasy</span>}
      </div>
    </div>
  )
}

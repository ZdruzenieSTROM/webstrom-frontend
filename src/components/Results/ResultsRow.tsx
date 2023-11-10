import {Typography} from '@mui/material'
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
      <Typography variant="h1" component="span" fontStyle="italic" className={styles.rank}>
        {rank_changed && rank_start + '.'}
      </Typography>
      <div className={styles.nameAndSchool}>
        <Typography variant="h2" component="span" fontStyle="italic" className={styles.name}>
          {registration.profile.first_name + ' ' + registration.profile.last_name}
        </Typography>
        <Typography variant="body3" className={styles.school}>
          {registration.school.name + ' ' + registration.school.street + ' ' + registration.school.city}
        </Typography>
      </div>
      <Typography variant="h3" component="span" fontWeight={400} fontStyle="italic" className={styles.grade}>
        {registration.grade}
      </Typography>
      <div className={styles.score}>
        {solutions.map((series, index) => (
          <div key={index}>
            {series.map((solution, index) => (
              <Typography variant="body2" key={index}>
                {solution.points}
              </Typography>
            ))}
            <Typography variant="body2" fontWeight={600} className={styles.subtotal}>
              {subtotal[index]}
            </Typography>
          </div>
        ))}
      </div>
      <Typography variant="h3" component="span" fontStyle="italic" className={styles.totalScore}>
        {total}
      </Typography>
      <div className={clsx(styles.votes, votes_total !== 0 && 'tooltip')}>
        {votes_total !== 0 && votes_total}
        {votes_total !== 0 && <span className="tooltiptext">Hlasy</span>}
      </div>
    </div>
  )
}

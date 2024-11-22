import {Typography} from '@mui/material'
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
  grade: {
    name: string
    tag: string
    years_until_graduation: number
    is_active: boolean
  }
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

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.rank}>
        <Typography variant="h1" component="span">
          {rank_changed && rank_start + '.'}
        </Typography>
      </div>
      <div className={styles.nameAndSchool}>
        <Typography variant="h2" component="span" className={styles.name}>
          {registration.profile.first_name + ' ' + registration.profile.last_name}
        </Typography>
        <Typography variant="body3" className={styles.school}>
          {registration.school.name + ' ' + registration.school.street + ' ' + registration.school.city}
        </Typography>
      </div>
      <div className={styles.grade}>
        <Typography variant="h3" component="span" fontWeight={400} fontStyle="italic">
          {registration.grade.tag}
        </Typography>
      </div>
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
      <div className={styles.totalScore}>
        <Typography variant="h3" component="span" fontStyle="italic">
          {total}
        </Typography>
      </div>
    </div>
  )
}

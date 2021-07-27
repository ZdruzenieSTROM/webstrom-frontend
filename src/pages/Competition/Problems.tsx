import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

import {Latex} from '../../components/Latex/Latex'
import {getSeminarName} from '../../components/PageLayout/components/MenuMain'
import styles from './Problems.module.css'

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

interface Semester {
  id: number
  series_set: Series[]
  semesterpublication_set: any[]
  unspecifiedpublication_set: any[]
  year: number
  school_year: string
  start: string
  end: string
  season_code: number
  frozen_results: boolean
  competition: number
  late_tags: any[]
}

type ProblemsProps = {
  seminarId: number
}

export const Problems: FC<ProblemsProps> = ({seminarId}) => {
  const router = useRouter()
  const {series} = router.query

  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [year, setYear] = useState<number>()

  const seminarName = getSeminarName(seminarId)

  useEffect(() => {
    const fetchData = async (series: number) => {
      try {
        const {data} = await axios.get<Semester[]>('/api/competition/semester/', {
          headers: {
            'Content-type': 'application/json',
          },
        })
        setProblems(data[0].series_set[series].problems)
        setYear(data[0].year)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    // seria query parametra nie je pristupna pri prvom renderi, tento check to riesi a pomaha aj s typescriptom
    typeof series === 'string' && fetchData(Number.parseInt(series))
  }, [series])

  return (
    <div className={styles.grid}>
      <div className={clsx(styles.cell, styles.threeColumns)}>
        <h3>ZADANIA - {year}.ROČNÍK - ZIMNÝ SEMESTER</h3>
      </div>
      <div className={styles.cell} />
      <div className={styles.cell} />
      <div className={styles.cell}>
        <h3>
          <Link href={`/${seminarName}/zadania/0`}>
            <a>1. SÉRIA ZIMNÉHO SEMESTRA</a>
          </Link>
        </h3>
      </div>
      <div className={styles.cell}>
        <h3>
          <Link href={`/${seminarName}/zadania/1`}>
            <a>2. SÉRIA ZIMNÉHO SEMESTRA</a>
          </Link>
        </h3>
      </div>
      <div className={styles.cell}>
        <h4 className={styles.changeSemester}>ZMENIŤ SEMESTER</h4>
      </div>

      {problems.map((problem) => (
        <div className={clsx(styles.cell, styles.threeColumns)} key={problem.id}>
          <h3 className={styles.problemTitle}>{problem.order}. ÚLOHA</h3>
          <Latex>{problem.text}</Latex>
        </div>
      ))}

      {error && <p>{error}</p>}
    </div>
  )
}

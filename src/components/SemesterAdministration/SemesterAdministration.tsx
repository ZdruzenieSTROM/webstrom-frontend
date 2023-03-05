import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useEffect, useRef, useState} from 'react'

import {SemesterWithProblems} from '@/types/api/generated/competition'

import {Button, Link} from '../Clickable/Clickable'
import styles from '../Problems/Problems.module.scss'
import {Result} from '../Results/Results'

interface PostalCard {
  code: number
  name: string
  abbreviation: string
  street: string
  city: string
  zip_code: string
  email: string
}

export const SemesterAdministration: FC = () => {
  const router = useRouter()
  const {params} = router.query
  const [semesterId, setSemesterId] = useState(params ? params[0] : 1)
  useEffect(() => {
    const {params} = router.query
    setSemesterId(params ? params[0] : 1)
  }, [router.query])
  const [textareaContent, setTextareaContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {data: semesterData} = useQuery(['competition', 'semester', semesterId], () =>
    axios.get<SemesterWithProblems>(`/api/competition/semester/${semesterId}`),
  )

  const getSemesterResults = async () => {
    const {data} = await axios.get<Result[]>(`/api/competition/semester/${semesterId}/results`)
    setTextareaContent(
      data
        .map((result: Result) => {
          let rank = ''
          if (result.rank_changed) {
            if (result.rank_start === result.rank_end) {
              rank = `${result.rank_start}.`
            } else {
              rank = `${result.rank_start}.-${result.rank_end}.`
            }
          }
          const name = `${result.registration.profile.first_name} ${result.registration.profile.last_name}`
          const subtotal = result.subtotal[0]
          const points = result.solutions[1]
            .map((problem) => {
              return problem.points
            })
            .join('&')
          return `${rank}&${name}&${result.registration.school.abbreviation}&${result.registration.grade}&${subtotal}&${points}&${result.total}\\\\`
        })
        .join('\n'),
    )
  }

  const getPostalCards = async (offline_only: boolean) => {
    const {data} = await axios.get<PostalCard[]>(
      `/api/competition/semester/${semesterId}/${offline_only ? 'offline-schools' : 'schools'}`,
    )
    setTextareaContent(
      data
        .map((result: PostalCard) => {
          return `\\stitok{${result.name}}{${result.city}}{${result.zip_code}}{${result.street}}`
        })
        .join('\n'),
    )
  }

  return (
    <>
      <h2>
        {semesterData?.data?.year}. ročník ({semesterData?.data.school_year})
      </h2>
      Administrácia semestra pre opravovateľov.
      {semesterData?.data.series_set.map((series) => {
        return (
          <div key={series.id}>
            <h3>{series.order}. séria</h3>
            <table>
              <tr>
                <td>Termín série:</td>
                <td>{series.deadline}</td>
              </tr>
              <tr>
                <td />
                <td />
              </tr>
            </table>
            <h4>Opravovanie úloh:</h4>
            {series?.problems.map((problem) => {
              return (
                <div key={problem.id}>
                  <Link href={`/strom/opravit-ulohu/${problem.id}`}>{problem.order}. úloha</Link>
                </div>
              )
            })}
          </div>
        )
      })}
      <h3>Generovanie dát</h3>
      <div className={styles.actions}>
        <Button onClick={getSemesterResults}>Poradie série</Button>
        <Button onClick={() => getPostalCards(false)}>Štítky na školy</Button>
        <Button onClick={() => getPostalCards(true)}>Štítky na školy (iba papierové riešenia)</Button>
        <Button>Zoznam riešiteľov</Button>
      </div>
      <div className={styles.actions}>
        <Button>Pozvánky pre školy</Button>
        <Button>Pozvánky pre účastníkov</Button>
      </div>
      {textareaContent ? (
        <div>
          <textarea ref={textareaRef} cols={100} rows={10} value={textareaContent} readOnly />
          <div className={styles.actions}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(textareaRef.current?.value ?? '')
              }}
            >
              kopírovať
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

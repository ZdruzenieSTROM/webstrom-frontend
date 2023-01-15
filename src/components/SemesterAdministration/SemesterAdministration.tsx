import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'
import {FC, useEffect, useRef, useState} from 'react'

import {SemesterWithProblems, SeriesWithProblems} from '@/types/api/generated/competition'

import {Button, Link} from '../Clickable/Clickable'
import styles from '../Problems/Problems.module.scss'
import {Result} from '../Results/Results'

export const SemesterAdministration: FC<{semesterIdInitial: number}> = ({semesterIdInitial}) => {
  const [semesterId, setSemesterId] = useState(semesterIdInitial)
  const [textareaContent, setTextareaContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {data: semesterData, isLoading: semesterIsLoading} = useQuery(['competition', 'semester', semesterId], () =>
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

  interface PostalCard {
    code: number
    name: string
    abbreviation: string
    street: string
    city: string
    zip_code: string
    email: string
  }

  const getPostalCards = async () => {
    const {data} = await axios.get<PostalCard[]>(`/api/competition/semester/${semesterId}/schools`)
    setTextareaContent('')
    setTextareaContent(
      data
        .map((result: PostalCard) => {
          return `\\stitok{` + result.name + `}{${result.city}}{${result.zip_code}}{${result.street}}`
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
      <div className={styles.actions}>
        <Button onClick={getSemesterResults}>Poradie série</Button>
        <Button>Pozvánky pre školy</Button>
        <Button>Pozvánky pre účastníkov</Button>
      </div>
      <div className={styles.actions}>
        <Button onClick={getPostalCards}>Štítky na školy</Button>
        <Button>Štítky na školy (iba papierové riešenia)</Button>
        <Button>Zoznam riešiteľov</Button>
      </div>
      {textareaContent ? (
        <div>
          <textarea ref={textareaRef} cols={100} rows={10}>
            {textareaContent}
          </textarea>
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
    </>
  )
}

import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {SemesterWithProblems} from '@/types/api/generated/competition'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Button, Link} from '../Clickable/Clickable'
import {Loading} from '../Loading/Loading'
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

  const semesterId = params && params[0]

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  const {data: semesterData} = useQuery({
    queryKey: ['competition', 'semester', semesterId],
    queryFn: () => axios.get<SemesterWithProblems>(`/api/competition/semester/${semesterId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym semesterId
    enabled: semesterId !== undefined,
  })
  const semester = semesterData?.data

  const [textareaContent, setTextareaContent] = useState('')

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
          const points = result.solutions[1].map((problem) => problem.points).join('&')
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
        .map((result: PostalCard) => `\\stitok{${result.name}}{${result.city}}{${result.zip_code}}{${result.street}}`)
        .join('\n'),
    )
  }

  if (permissionsIsLoading) return <Loading />
  if (!hasPermissions) return <span>Nemáš oprávnenie na zobrazenie tejto stránky.</span>

  return (
    <>
      <h2>
        {semester?.year}. ročník ({semester?.school_year}) - {semester?.season_code === 0 ? 'zima' : 'leto'}
      </h2>
      Administrácia semestra pre opravovateľov.
      {semester?.series_set.map((series) => (
        <div key={series.id}>
          <h3>{series.order}. séria</h3>
          <table>
            <tbody>
              <tr>
                <td>Termín série:</td>
                <td>{series.deadline}</td>
              </tr>
              <tr>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
          <h4>Opravovanie úloh:</h4>
          {series?.problems.map((problem) => (
            <div key={problem.id}>
              <Link href={`/strom/admin/opravit-ulohu/${problem.id}`}>{problem.order}. úloha</Link>
            </div>
          ))}
        </div>
      ))}
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
          <textarea cols={100} rows={10} value={textareaContent} readOnly />
          <div className={styles.actions}>
            <Button onClick={() => navigator.clipboard.writeText(textareaContent)}>kopírovať</Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

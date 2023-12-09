import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {SemesterWithProblems} from '@/types/api/generated/competition'
import {formatDateTime} from '@/utils/formatDate'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Loading} from '../Loading/Loading'
import {PublicationUploader} from '../PublicationUploader/PublicationUploader'
import {Result} from '../Results/ResultsRow'
import styles from './SemesterAdministration.module.scss'

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

  const {data: semesterData, isLoading: semesterIsLoading} = useQuery({
    queryKey: ['competition', 'semester', semesterId],
    queryFn: () => axios.get<SemesterWithProblems>(`/api/competition/semester/${semesterId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym semesterId
    enabled: semesterId !== undefined,
  })
  const semester = semesterData?.data

  const [textareaContent, setTextareaContent] = useState('')

  const getResults = async (seriesId: number | null) => {
    const isSemester = seriesId === null
    const {data} = await axios.get<Result[]>(
      isSemester ? `/api/competition/semester/${semesterId}/results` : `/api/competition/series/${seriesId}/results`,
    )
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
          if (isSemester) {
            const subtotal = result.subtotal[0]
            const points = result.solutions[1].map((problem) => problem.points).join('&')
            return `${rank}&${name}&${result.registration.school.abbreviation}&${result.registration.grade}&${subtotal}&${points}&${result.total}\\\\`
          } else {
            const points = result.solutions[0].map((problem) => problem.points).join('&')
            return `${rank}&${name}&${result.registration.school.abbreviation}&${result.registration.grade}&${points}&${result.total}\\\\`
          }
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

  if (permissionsIsLoading || semesterIsLoading) return <Loading />
  if (!hasPermissions) return <span>Nemáš oprávnenie na zobrazenie tejto stránky.</span>
  if (semesterId === undefined || !semester)
    return (
      <Typography variant="body1">
        Nevalidný semester (semesterId) v URL alebo ho proste nevieme fetchnúť z BE.
      </Typography>
    )

  return (
    <>
      <Typography variant="h2">
        {semester.year}. ročník ({semester.school_year}) - {semester.season_code === 0 ? 'zima' : 'leto'}
      </Typography>
      <Typography variant="body1" component="div">
        Administrácia semestra pre opravovateľov.
      </Typography>
      {semester.series_set.map((series) => (
        <div key={series.id}>
          <Typography variant="h3">{series.order}. séria</Typography>
          <Typography variant="body1" component="div">
            {' '}
            Termín série: {formatDateTime(series.deadline)}
          </Typography>
          <Typography variant="h3">Opravovanie úloh:</Typography>
          {series?.problems.map((problem) => (
            <div key={problem.id}>
              <Link variant="button2" href={`/strom/admin/opravit-ulohu/${problem.id}`}>
                {problem.order}. úloha
              </Link>
            </div>
          ))}
        </div>
      ))}
      <Typography variant="h3">Generovanie dát</Typography>
      <div className={styles.actions}>
        {[...semester.series_set].reverse().map((series) => (
          <div key={series.id}>
            <Button variant="button3" onClick={() => getResults(series.id)}>
              Poradie {series.order}. série
            </Button>
          </div>
        ))}
        <Button variant="button3" onClick={() => getResults(null)}>
          Poradie semestra
        </Button>
      </div>
      <div className={styles.actions}>
        <Button variant="button3" onClick={() => getPostalCards(false)}>
          Štítky na školy
        </Button>
        <Button variant="button3" onClick={() => getPostalCards(true)}>
          Štítky na školy (iba papierové riešenia)
        </Button>
      </div>
      <div className={styles.actions}>
        <Button variant="button3"> Pozvánky pre školy</Button>
        <Button variant="button3">Pozvánky pre účastníkov</Button>
      </div>
      <div className={styles.actions}>
        <Link variant="button3" href={`/api/competition/semester/${semesterId}/participants-export/`}>
          Zoznam riešiteľov
        </Link>
      </div>
      {textareaContent ? (
        <div>
          <textarea cols={100} rows={10} value={textareaContent} readOnly />
          <div className={styles.actions}>
            <Button variant="button2" onClick={() => navigator.clipboard.writeText(textareaContent)}>
              kopírovať
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Stack mt={1} gap={1}>
        <Typography variant="h3">Nahrávanie časopisov</Typography>
        {[1, 2, 3].map((order) => (
          <PublicationUploader key={order} semesterId={semesterId} order={order} semesterData={semester} />
        ))}
      </Stack>
    </>
  )
}

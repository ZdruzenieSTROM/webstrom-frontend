import {Stack, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useState} from 'react'

import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {SemesterWithProblems} from '@/types/api/generated/competition'
import {formatDateTime} from '@/utils/formatDate'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {Loading} from '../Loading/Loading'
import {PublicationUploader} from '../PublicationUploader/PublicationUploader'
import {Result} from '../Results/ResultsRow'

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
  const {
    id: {semesterId},
    loading: urlDataLoading,
  } = useDataFromURL()

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

  if (
    urlDataLoading.currentSeriesIsLoading ||
    urlDataLoading.semesterListIsLoading ||
    permissionsIsLoading ||
    semesterIsLoading
  )
    return <Loading />
  if (!hasPermissions) return <Typography variant="body1">Nemáš oprávnenie na zobrazenie tejto stránky.</Typography>
  if (semesterId === undefined || !semester)
    return (
      <Typography variant="body1">
        Nevalidný semester (semesterId) v URL alebo ho proste nevieme fetchnúť z BE.
      </Typography>
    )

  return (
    <>
      <Typography variant="h3">Administrácia semestra pre opravovateľov.</Typography>
      {semester.series_set.map((series) => (
        <Stack key={series.id} gap={1} mt={5}>
          <Typography variant="h2">{series.order}. séria</Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">Opravovanie úloh:</Typography>
            <Typography variant="body1" component="div">
              <b>Termín série:</b> {formatDateTime(series.deadline)}
            </Typography>
          </Stack>
          <Stack px={2} direction="row" justifyContent="space-between">
            {series?.problems.map((problem) => (
              <Link key={problem.id} variant="button2" href={`/strom/admin/opravit-ulohu/${problem.id}`}>
                {problem.order}. úloha
              </Link>
            ))}
          </Stack>
        </Stack>
      ))}

      <Typography variant="h2" mt={5}>
        Generovanie poradia
      </Typography>
      <Stack pl={2} alignItems="start">
        {[...semester.series_set].reverse().map((series) => (
          <Button key={series.id} variant="button2" onClick={() => getResults(series.id)}>
            Poradie {series.order}. série
          </Button>
        ))}
        <Button variant="button2" onClick={() => getResults(null)}>
          Poradie semestra
        </Button>
      </Stack>

      <Typography variant="h2" mt={5}>
        Generovanie štítkov
      </Typography>
      <Stack pl={2} alignItems="start">
        <Button variant="button2" onClick={() => getPostalCards(false)}>
          Štítky na školy
        </Button>
        <Button variant="button2" onClick={() => getPostalCards(true)}>
          Štítky na školy (iba papierové riešenia)
        </Button>
      </Stack>

      <Typography variant="h2" mt={5}>
        Generovanie pozvánok
      </Typography>
      <Stack pl={2} alignItems="start">
        <Button variant="button2"> Pozvánky pre školy</Button>
        <Button variant="button2">Pozvánky pre účastníkov</Button>
      </Stack>

      <Typography variant="h2" mt={5}>
        Generovanie zoznamu
      </Typography>
      <Stack pl={2} alignItems="start">
        <Link variant="button2" href={`/api/competition/semester/${semesterId}/participants-export/`}>
          Zoznam riešiteľov
        </Link>
      </Stack>

      {textareaContent && (
        <Stack mt={5} gap={2} alignItems="end">
          <textarea rows={10} value={textareaContent} readOnly style={{width: '100%'}} />
          <Button variant="button2" onClick={() => navigator.clipboard.writeText(textareaContent)}>
            kopírovať
          </Button>
        </Stack>
      )}

      <Stack mt={1} gap={1}>
        <Typography variant="h2" sx={{marginTop: 3}}>
          Nahrávanie časopisov
        </Typography>
        {[1, 2, 3].map((order) => (
          <PublicationUploader key={order} semesterId={semesterId} order={order} semesterData={semester} />
        ))}
      </Stack>
    </>
  )
}

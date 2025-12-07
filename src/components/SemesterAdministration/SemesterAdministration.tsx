import {Grid, Stack, Typography} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {FC, Fragment, useState} from 'react'
import {useForm} from 'react-hook-form'

import {apiOptions} from '@/api/api'
import {apiAxios} from '@/api/apiAxios'
import {Button} from '@/components/Clickable/Button'
import {Link} from '@/components/Clickable/Link'
import {FormInput} from '@/components/FormItems/FormInput/FormInput'
import {SeriesWithProblems} from '@/types/api/generated/competition'
import {formatDateTime} from '@/utils/formatDate'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {useHasPermissions} from '@/utils/useHasPermissions'

import {School} from '../../types/api/personal'
import {Dialog} from '../Dialog/Dialog'
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

interface Invitation {
  first_name: string
  last_name: string
  is_participant: boolean
}

interface SchoolInvitation {
  participants: Invitation[]
  school_name: School
}

type InvitationFormValues = {
  num_participants: number
  num_substitutes: number
}

const defaultValues: InvitationFormValues = {
  num_participants: 32,
  num_substitutes: 20,
}

const invitationToName = (dataRow: Invitation) => `${dataRow.first_name} ${dataRow.last_name}`

const formatInvitationRow = (invitation: Invitation) =>
  invitation.is_participant
    ? String.raw`\ucastnik{${invitationToName(invitation)}}`
    : String.raw`\nahradnik{${invitationToName(invitation)}}`

export const SemesterAdministration: FC = () => {
  const {
    id: {semesterId},
    loading: urlDataLoading,
    seminar,
  } = useDataFromURL()

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  const {
    data: semester,
    isLoading: semesterIsLoading,
    refetch,
  } = useQuery(apiOptions.competition.semester.byId(semesterId))

  const [textareaContent, setTextareaContent] = useState('')
  const [displayInvitationDialog, setDisplayInvitationDialog] = useState(false)
  const toggleInvitationDialog = () => {
    setDisplayInvitationDialog((prev) => !prev)
  }
  const {control, getValues} = useForm<InvitationFormValues>({defaultValues})

  const getResults = async (seriesId: number | null) => {
    const isSemester = seriesId === null

    const {data} = await apiAxios.get<Result[]>(
      isSemester ? `/competition/semester/${semesterId}/results` : `/competition/series/${seriesId}/results`,
    )
    setTextareaContent(
      data
        .map((result: Result) => {
          const rank = result.rank_changed
            ? result.rank_start === result.rank_end
              ? `${result.rank_start}.`
              : `${result.rank_start}.-${result.rank_end}.`
            : ''

          const name = `${result.registration.profile.first_name} ${result.registration.profile.last_name}`
          if (isSemester) {
            const subtotal = result.subtotal[0]
            const points = result.solutions[1].map((problem) => problem.points).join('&')
            return `${rank}&${name}&${result.registration.school.abbreviation}&${result.registration.grade.tag}&${subtotal}&${points}&${result.total}\\\\`
          } else {
            const points = result.solutions[0].map((problem) => problem.points).join('&')
            return `${rank}&${name}&${result.registration.school.abbreviation}&${result.registration.grade.tag}&${points}&${result.total}\\\\`
          }
        })
        .join('\n'),
    )
  }

  const getPostalCards = async (offline_only: boolean) => {
    const {data} = await apiAxios.get<PostalCard[]>(
      `/competition/semester/${semesterId}/${offline_only ? 'offline-schools' : 'schools'}`,
    )
    setTextareaContent(
      data
        .map(
          (result: PostalCard) =>
            String.raw`\stitok{${result.name}}{${result.city}}{${result.zip_code}}{${result.street}}`,
        )
        .join('\n'),
    )
  }

  const getInvites = async () => {
    const {num_participants, num_substitutes} = getValues()
    const {data} = await apiAxios.get<Invitation[]>(
      `/competition/semester/${semesterId}/invitations/${num_participants}/${num_substitutes}`,
    )
    toggleInvitationDialog()
    const result = []
    const dataInvited = data.filter((item) => item.is_participant)
    const dataSubstitutes = data.filter((item) => !item.is_participant)

    for (let i = 0; i < dataInvited.length; i += 2) {
      result.push(String.raw`\P{${invitationToName(dataInvited[i])}}{${invitationToName(dataInvited[i + 1]) ?? ''}}`)
    }
    for (let i = 0; i < dataSubstitutes.length; i += 2) {
      result.push(
        String.raw`\N{${invitationToName(dataSubstitutes[i])}}{${invitationToName(dataSubstitutes[i + 1]) ?? ''}}`,
      )
    }
    setTextareaContent(result.join('\n'))
  }

  const getSchoolInvites = async () => {
    const {num_participants, num_substitutes} = getValues()
    const {data} = await apiAxios.get<SchoolInvitation[]>(
      `/competition/semester/${semesterId}/school-invitations/${num_participants}/${num_substitutes}`,
    )
    toggleInvitationDialog()
    setTextareaContent(
      data
        .map(
          (school) =>
            `\\begin{skola}{${school.school_name.name}}{${school.school_name.street}}{${school.school_name.zip_code}}{${school.school_name.city}}\n${school.participants.map((item) => formatInvitationRow(item)).join('\n')}\n\\end{skola}`,
        )
        .join('\n\n'),
    )
  }

  const [seriesFreezeErrors, setSeriesFreezeErrors] = useState<Map<number, string>>()
  const [seriesToFreeze, setSeriesToFreeze] = useState<SeriesWithProblems | null>(null)
  const [seriesToUnfreeze, setSeriesToUnfreeze] = useState<SeriesWithProblems | null>(null)

  const {mutate: freezeSeries} = useMutation({
    mutationFn: (series: SeriesWithProblems) => apiAxios.post(`/competition/series/${series.id}/results/freeze`),
    onSuccess: (_, variables: SeriesWithProblems) => {
      setSeriesFreezeErrors((prev) => new Map(prev).set(variables.id, ''))
      refetch()
    },
    onError: (error: unknown, variables: SeriesWithProblems) => {
      if (error instanceof AxiosError) {
        setSeriesFreezeErrors((prev) => new Map(prev).set(variables.id, error.response?.data.detail))
      } else {
        setSeriesFreezeErrors((prev) => new Map(prev).set(variables.id, 'Nastala neznáma chyba.'))
      }
    },
  })

  const {mutate: unfreezeSeries} = useMutation({
    mutationFn: (series: SeriesWithProblems) => apiAxios.post(`/competition/series/${series.id}/results/unfreeze`),
    onSuccess: (_, variables: SeriesWithProblems) => {
      setSeriesFreezeErrors((prev) => new Map(prev).set(variables.id, ''))
      refetch()
    },
    onError: (error: unknown, variables: SeriesWithProblems) => {
      if (error instanceof AxiosError) {
        setSeriesFreezeErrors((prev) => new Map(prev).set(variables.id, error.response?.data.detail))
      } else {
        setSeriesFreezeErrors((prev) => new Map(prev).set(variables.id, 'Nastala neznáma chyba.'))
      }
    },
  })

  if (
    urlDataLoading.currentSeriesIsLoading ||
    urlDataLoading.semesterListIsLoading ||
    permissionsIsLoading ||
    semesterIsLoading
  )
    return <Loading />
  if (!hasPermissions) return <Typography variant="body1">Nemáš oprávnenie na zobrazenie tejto stránky.</Typography>
  if (semesterId == null || !semester)
    return (
      <Typography variant="body1">
        Nevalidný semester (semesterId) v URL alebo ho proste nevieme fetchnúť z BE.
      </Typography>
    )

  return (
    <>
      <Dialog
        open={displayInvitationDialog}
        close={toggleInvitationDialog}
        title="Pozvánky"
        actions={
          <>
            <Button variant="button2" onClick={() => void getInvites()}>
              Pozvánky pre účastníkov
            </Button>
            <Button variant="button2" onClick={() => void getSchoolInvites()}>
              Pozvánky pre školy
            </Button>
          </>
        }
      >
        <FormInput control={control} name="num_participants" label="počet účastníkov" />
        <FormInput control={control} name="num_substitutes" label="počet náhradníkov" />
      </Dialog>
      <Dialog
        open={!!seriesToFreeze}
        close={() => setSeriesToFreeze(null)}
        title="Uzavretie série"
        contentText="Naozaj chceš uzavrieť túto sériu? Po uzavretí už nebude možné meniť výsledky riešiteľov v danej sérii."
        actions={
          <>
            <Button
              variant="button2"
              onClick={() => {
                if (seriesToFreeze) freezeSeries(seriesToFreeze)
                setSeriesToFreeze(null)
              }}
            >
              Áno
            </Button>
            <Button variant="button2" onClick={() => setSeriesToFreeze(null)}>
              Nie
            </Button>
          </>
        }
      />
      <Dialog
        open={!!seriesToUnfreeze}
        close={() => setSeriesToUnfreeze(null)}
        title="Otvorenie série"
        contentText="Naozaj chceš znovu otvoriť túto sériu a povoliť zmeny vo výsledkoch?"
        actions={
          <>
            <Button
              variant="button2"
              onClick={() => {
                if (seriesToUnfreeze) unfreezeSeries(seriesToUnfreeze)
                setSeriesToUnfreeze(null)
              }}
            >
              Áno
            </Button>
            <Button variant="button2" onClick={() => setSeriesToUnfreeze(null)}>
              Nie
            </Button>
          </>
        }
      />

      <Stack alignItems="start" direction="row" spacing={2}>
        <Typography variant="h2">Semester</Typography>
        {semester.complete && <Typography variant="body1">Semester je uzavretý</Typography>}
      </Stack>
      {semester.series_set.map((series) => (
        <Stack key={series.id} gap={1} mt={5}>
          <Stack alignItems="start" direction="row" spacing={2}>
            <Typography variant="h3">{series.order}. séria</Typography>
            <Typography variant="body1">{series.complete ? 'Séria je uzavretá' : 'Séria je otvorená'}</Typography>
            <Button
              variant="button2"
              onClick={() => (series.complete ? setSeriesToUnfreeze(series) : setSeriesToFreeze(series))}
            >
              {series.complete ? 'Otvoriť sériu' : 'Uzavrieť sériu'}
            </Button>
            {seriesFreezeErrors?.get(series.id) && (
              <Typography variant="body1">{seriesFreezeErrors?.get(series.id)}</Typography>
            )}
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" component="div">
              <b>Opravovanie úloh:</b>
            </Typography>
            <Typography variant="body1" component="div">
              <b>Termín série:</b> {formatDateTime(series.deadline)}
            </Typography>
          </Stack>
          <Grid container spacing={2} size={{xs: 12, md: 9}}>
            {series?.problems.map((problem) => (
              <Fragment key={problem.id}>
                <Grid size={4}>
                  <Link key={problem.id} variant="button2" href={`/${seminar}/admin/opravit-ulohu/${problem.id}`}>
                    {problem.order}. úloha
                  </Link>
                </Grid>
                <Grid size={4} textAlign="center">
                  <Typography variant="body1" component="div">
                    {problem.num_corrected_solutions === problem.num_solutions
                      ? `Opravené (${problem.num_solutions})`
                      : `${problem.num_corrected_solutions}/${problem.num_solutions}`}
                  </Typography>
                </Grid>
                <Grid size={4} textAlign="center">
                  {problem.solution_pdf ? (
                    <Link key={problem.id} variant="button2" href={problem.solution_pdf}>
                      Vzorák
                    </Link>
                  ) : (
                    <>{'chýba vzorák'}</>
                  )}
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Stack>
      ))}

      <Typography variant="h2" mt={5}>
        Generovanie poradia
      </Typography>
      <Stack pl={2} alignItems="start">
        {semester.series_set.toReversed().map((series) => (
          <Button key={series.id} variant="button2" onClick={() => void getResults(series.id)}>
            Poradie {series.order}. série
          </Button>
        ))}
        <Button variant="button2" onClick={() => void getResults(null)}>
          Poradie semestra
        </Button>
      </Stack>

      <Typography variant="h2" mt={5}>
        Generovanie štítkov
      </Typography>
      <Stack pl={2} alignItems="start">
        <Button variant="button2" onClick={() => void getPostalCards(false)}>
          Štítky na školy
        </Button>
        <Button variant="button2" onClick={() => void getPostalCards(true)}>
          Štítky na školy (iba papierové riešenia)
        </Button>
      </Stack>

      <Typography variant="h2" mt={5}>
        Generovanie pozvánok
      </Typography>
      <Stack pl={2} alignItems="start">
        <Button variant="button2" onClick={() => toggleInvitationDialog()}>
          Generovanie pre pozvánky
        </Button>
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
          <Button variant="button2" onClick={() => void navigator.clipboard.writeText(textareaContent)}>
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

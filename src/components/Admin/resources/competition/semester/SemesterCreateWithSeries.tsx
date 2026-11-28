import {Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography} from '@mui/material'
import {FC, useEffect, useRef, useState} from 'react'
import {
  CheckboxGroupInput,
  Form,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  ResourceContextProvider,
  SelectInput,
  TextInput,
  Title,
  useDataProvider,
  useNotify,
  useRedirect,
  useTranslate,
} from 'react-admin'
import {useFormContext, useWatch} from 'react-hook-form'

import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyDateTimeSplitInput} from '@/components/Admin/custom/MyDateTimeSplitInput'
import {seasonCodeStrings} from '@/components/Admin/seasonCodeStrings'

import {bumpSchoolYear, shiftIso} from './semesterPrefillHelpers'

const DEFAULT_DEADLINE_TIME = '20:00:00'
const SEASON_ZIMNY = 0
const SEASON_LETNY = 1

type SemesterRecord = {
  id: number
  competition: number
  year: number
  season_code: 0 | 1
  school_year: string
  start: string
  end: string
  late_tags: number[]
}

type FormValues = {
  competition?: number
  year?: number
  season_code?: 0 | 1
  school_year?: string
  late_tags?: number[]
  start?: string
  end?: string
  series_1_deadline?: string
  series_2_deadline?: string
}

export const SemesterCreateWithSeries: FC = () => (
  <ResourceContextProvider value="competition/semester">
    <Title title="content.semester_with_series.title" />
    <Card sx={{mt: 2}}>
      <CardContent>
        <Form>
          <FormBody />
        </Form>
      </CardContent>
    </Card>
  </ResourceContextProvider>
)

const FormBody: FC = () => {
  const dataProvider = useDataProvider()
  const notify = useNotify()
  const redirect = useRedirect()
  const translate = useTranslate()
  const {setValue, handleSubmit} = useFormContext<FormValues>()

  const [lastPrefilledCompetitionId, setLastPrefilledCompetitionId] = useState<number | null>(null)
  const [createdSemesterId, setCreatedSemesterId] = useState<number | null>(null)
  const [createdSeriesIds, setCreatedSeriesIds] = useState<[number | null, number | null]>([null, null])
  const [submitting, setSubmitting] = useState(false)
  const [prefillLoading, setPrefillLoading] = useState(false)
  // Guard so auto-prefill fires only once in this form lifetime (the first competition pick).
  const autoPrefilledRef = useRef(false)

  const competitionId = useWatch<FormValues, 'competition'>({name: 'competition'})
  const series2Deadline = useWatch<FormValues, 'series_2_deadline'>({name: 'series_2_deadline'})

  // Derived `end` = series_2_deadline + 14 days. Runs whenever series_2 changes.
  // The user can still manually override `end`; the next deadline change overwrites again (by design).
  useEffect(() => {
    if (series2Deadline === undefined) return
    setValue('end', shiftIso(series2Deadline, {days: 14}), {shouldDirty: false})
  }, [series2Deadline, setValue])

  const runPrefill = async (compId: number) => {
    setPrefillLoading(true)
    try {
      const {data: semesters} = await dataProvider.getList<SemesterRecord>('competition/semester', {
        filter: {competition: compId},
        sort: {field: 'year', order: 'DESC'},
        pagination: {page: 1, perPage: 20},
      })

      if (semesters.length === 0) {
        notify('content.notifications.semester_with_series.prefill_no_semesters', {type: 'info'})
        setLastPrefilledCompetitionId(compId)
        return
      }

      const mostRecent = semesters[0]
      // most recent letný  => both exist for that year  => next is zimný of year+1, school_year bumped
      // most recent zimný  => only zimný exists         => next is letný of same year, same school_year
      const targetSeason = mostRecent.season_code === SEASON_LETNY ? SEASON_ZIMNY : SEASON_LETNY
      const targetYear = mostRecent.season_code === SEASON_LETNY ? mostRecent.year + 1 : mostRecent.year
      const targetSchoolYear =
        mostRecent.season_code === SEASON_LETNY ? bumpSchoolYear(mostRecent.school_year) : mostRecent.school_year

      const dateSource = semesters.find((s) => s.season_code === targetSeason)

      setValue('year', targetYear, {shouldDirty: false})
      setValue('season_code', targetSeason, {shouldDirty: false})
      setValue('school_year', targetSchoolYear, {shouldDirty: false})

      if (dateSource) {
        setValue('start', shiftIso(dateSource.start, {years: 1}), {shouldDirty: false})
        setValue('late_tags', dateSource.late_tags ?? [], {shouldDirty: false})
      } else {
        notify('content.notifications.semester_with_series.prefill_no_same_season', {
          type: 'info',
          messageArgs: {
            season: translate(
              targetSeason === SEASON_ZIMNY
                ? 'content.semester_with_series.season_winter'
                : 'content.semester_with_series.season_summer',
            ),
          },
        })
      }

      setLastPrefilledCompetitionId(compId)
    } catch {
      notify('content.notifications.semester_with_series.prefill_fetch_error', {type: 'error'})
    } finally {
      setPrefillLoading(false)
    }
  }

  // Auto-prefill on the first competition selection only; subsequent competition changes require the button.
  useEffect(() => {
    if (competitionId === undefined) return
    if (autoPrefilledRef.current) return
    if (lastPrefilledCompetitionId !== null) return
    autoPrefilledRef.current = true
    void runPrefill(competitionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitionId])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    let semesterId = createdSemesterId
    try {
      if (semesterId === null) {
        try {
          const {data} = await dataProvider.create<SemesterRecord>('competition/semester', {
            data: {
              competition: values.competition,
              year: values.year,
              season_code: values.season_code,
              school_year: values.school_year,
              start: values.start,
              end: values.end,
              late_tags: values.late_tags ?? [],
            },
          })
          semesterId = data.id
          setCreatedSemesterId(semesterId)
          notify('content.notifications.semester_with_series.semester_created', {type: 'success'})
        } catch (error) {
          notify('content.notifications.semester_with_series.semester_error', {
            type: 'error',
            messageArgs: {message: (error as Error).message},
          })
          return
        }
      }

      const newSeriesIds: [number | null, number | null] = [...createdSeriesIds]
      const seriesPayloads = [
        {order: 1, deadline: values.series_1_deadline},
        {order: 2, deadline: values.series_2_deadline},
      ]

      for (const [i, payload] of seriesPayloads.entries()) {
        if (newSeriesIds[i] !== null) continue
        try {
          const {data} = await dataProvider.create<{id: number}>('competition/series', {
            data: {semester: semesterId, ...payload},
          })
          newSeriesIds[i] = data.id
          setCreatedSeriesIds([...newSeriesIds] as [number | null, number | null])
        } catch (error) {
          notify('content.notifications.semester_with_series.series_error', {
            type: 'error',
            messageArgs: {order: i + 1, message: (error as Error).message},
          })
        }
      }

      if (newSeriesIds[0] !== null && newSeriesIds[1] !== null) {
        notify('content.notifications.semester_with_series.all_series_created', {type: 'success'})
        redirect('show', 'competition/semester', semesterId)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const showRerunButton =
    competitionId !== undefined && lastPrefilledCompetitionId !== null && lastPrefilledCompetitionId !== competitionId

  const semesterLocked = createdSemesterId !== null

  return (
    <Stack gap={2}>
      {semesterLocked && (
        <Alert severity="success">
          {translate('content.semester_with_series.semester_locked', {id: createdSemesterId})}
        </Alert>
      )}

      <Box>
        <Stack direction="row" alignItems="center" gap={1} sx={{mb: 1, mt: 1}}>
          <Typography variant="body1" component="h3" sx={{fontWeight: 700}}>
            {translate('content.semester_with_series.semester_heading')}
          </Typography>
          {prefillLoading && (
            <>
              <CircularProgress size={14} />
              <Typography variant="body1" sx={{opacity: 0.7}}>
                {translate('content.semester_with_series.prefilling')}
              </Typography>
            </>
          )}
        </Stack>
        <ReferenceInput source="competition" reference="competition/competition">
          <SelectInput validate={required()} disabled={semesterLocked} />
        </ReferenceInput>
        {showRerunButton && (
          <Box sx={{mb: 2}}>
            <Button
              variant="outlined"
              size="small"
              disabled={semesterLocked}
              onClick={() => competitionId !== undefined && runPrefill(competitionId)}
            >
              {translate('content.semester_with_series.prefill_button')}
            </Button>
          </Box>
        )}
        <NumberInput
          source="year"
          helperText="content.helpers.event_year"
          validate={required()}
          disabled={semesterLocked}
        />
        <SelectInput source="season_code" choices={seasonCodeStrings} validate={required()} disabled={semesterLocked} />
        <TextInput
          source="school_year"
          helperText="content.helpers.school_year"
          validate={required()}
          disabled={semesterLocked}
        />
        <ReferenceArrayInput source="late_tags" reference="competition/late-tag">
          <CheckboxGroupInput
            label="resources.competition/semester.fields.late_tags"
            helperText="content.helpers.late_tags"
            disabled={semesterLocked}
          />
        </ReferenceArrayInput>
        <MyDateTimeInput source="start" validate={required()} disabled={semesterLocked} />
      </Box>

      <Typography variant="body1" component="h3" sx={{mb: 1, mt: 2, fontWeight: 700}}>
        {translate('content.semester_with_series.series_heading', {order: 1})}
      </Typography>
      <SeriesRow
        deadlineSource="series_1_deadline"
        createdId={createdSeriesIds[0]}
        defaultTime={DEFAULT_DEADLINE_TIME}
      />

      <Typography variant="body1" component="h3" sx={{mb: 1, mt: 2, fontWeight: 700}}>
        {translate('content.semester_with_series.series_heading', {order: 2})}
      </Typography>
      <SeriesRow
        deadlineSource="series_2_deadline"
        createdId={createdSeriesIds[1]}
        defaultTime={DEFAULT_DEADLINE_TIME}
      />

      <Box>
        <Typography variant="body1" component="h3" sx={{mb: 1, mt: 2, fontWeight: 700}}>
          {translate('content.semester_with_series.end_heading')}
        </Typography>
        <Box sx={{mb: 1, opacity: 0.7}}>{translate('content.semester_with_series.end_hint')}</Box>
        <MyDateTimeInput source="end" validate={required()} />
      </Box>

      <Box>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={submitting}>
          {translate(submitting ? 'content.semester_with_series.submitting' : 'content.semester_with_series.submit')}
        </Button>
      </Box>
    </Stack>
  )
}

const SeriesRow: FC<{
  deadlineSource: 'series_1_deadline' | 'series_2_deadline'
  createdId: number | null
  defaultTime: string
}> = ({deadlineSource, createdId, defaultTime}) => {
  const translate = useTranslate()

  return (
    <Box>
      {createdId !== null && (
        <Alert severity="success">{translate('content.semester_with_series.series_created', {id: createdId})}</Alert>
      )}
      <MyDateTimeSplitInput
        source={deadlineSource}
        label="resources.competition/series.fields.deadline"
        defaultTime={defaultTime}
        validate={required()}
        disabled={createdId !== null}
      />
    </Box>
  )
}

import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {Box, Stack, Typography} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {useMutation, useQuery} from '@tanstack/react-query'
import {isAxiosError} from 'axios'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {FC, useCallback, useMemo, useState} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {apiOptions} from '@/api/api'
import {apiAxios} from '@/api/apiAxios'
import {colors} from '@/theme/colors'
import {SolutionAdministration} from '@/types/api/competition'
import {Accept} from '@/utils/dropzoneAccept'
import {getCorrectedSolutionUrl, getSolutionUrl} from '@/utils/getSolutionUrl'
import {useAlert} from '@/utils/useAlert'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useNavigationTrap} from '@/utils/useNavigationTrap'
import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {Button} from '../Clickable/Button'
import {Link} from '../Clickable/Link'
import {Dialog} from '../Dialog/Dialog'
import {FileDropZone} from '../FileDropZone/FileDropZone'
import {FileUploader} from '../FileUploader/FileUploader'
import {Loading} from '../Loading/Loading'
import {Markdown} from '../Markdown/Markdown'

const styles = {
  icon: {
    color: colors.black,
  },
  iconDisabled: {
    color: colors.gray,
  },
  input: {
    width: '30px',
    textAlign: 'center',
  },
  table: {
    display: 'grid',
    gridGap: '10px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    textTransform: 'uppercase',
    fontStyle: 'italic',
    fontWeight: 'bold',
    padding: '10px',
  },
  tableBody: {
    display: 'grid',
    gridGap: '10px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '10px',
  },
  centerCell: {
    placeSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: '8px',
  },
}

type SortKey = 'name' | 'points'

const getSolutionName = (solution: SolutionAdministration) =>
  `${solution.semester_registration?.profile.first_name ?? ''} ${solution.semester_registration?.profile.last_name ?? ''}`.trim()

export const ProblemAdministration: FC = () => {
  const {alert} = useAlert()
  const router = useRouter()
  const {seminar} = useSeminarInfo()
  const {params} = router.query

  const problemId = params && params[0]

  const {
    data: problem,
    refetch: refetchProblem,
    isLoading: problemIsLoading,
  } = useQuery(apiOptions.competition.problemAdministration.byId(problemId))

  const semesterId = problem?.series?.semester
  const {data: semester, isLoading: semesterIsLoading} = useQuery(apiOptions.competition.semester.byId(semesterId))
  const semesterName = semester?.season_code === 0 ? 'zima' : 'leto'
  const semesterUrl = `${semester?.year}/${semesterName}`

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  const baseline = problem?.solution_set
  const [draftScores, setDraftScores] = useState<Map<number, number | null>>(new Map())
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const baselineById = useMemo(() => new Map((baseline ?? []).map((row) => [row.id, row])), [baseline])

  const dirtyIds = useMemo(() => {
    const ids = new Set<number>()
    for (const [id, draftScore] of draftScores) {
      // Skip orphan drafts for solutions removed server-side; otherwise they'd keep
      // isDirty true forever with no row in the UI to explain it.
      if (!baselineById.has(id)) continue
      const baselineScore = baselineById.get(id)?.score ?? null
      if (draftScore !== baselineScore) ids.add(id)
    }
    return ids
  }, [draftScores, baselineById])

  const isDirty = dirtyIds.size > 0

  const displayScore = (row: SolutionAdministration): number | null =>
    draftScores.has(row.id) ? (draftScores.get(row.id) ?? null) : (row.score ?? null)

  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const {continueNavigation} = useNavigationTrap({
    shouldBlockNavigation: isDirty,
    onNavigate: () => {
      setExitDialogOpen(true)
    },
  })

  const {mutate: uploadPoints, isPending: uploadPointsIsPending} = useMutation({
    mutationFn: (id: string) => {
      const merged = (baseline ?? []).map((row) =>
        draftScores.has(row.id) ? {...row, score: draftScores.get(row.id) ?? null} : row,
      )
      return apiAxios.post(`/competition/problem-administration/${id}/upload-points`, {
        solution_set: merged,
      })
    },
    onSuccess: () => {
      alert('Body boli úspešne uložené.')
      return refetchProblem()
    },
  })

  const updateScore = (id: number, newPointsInput: string) => {
    const newPoints = Number.parseInt(newPointsInput)
    const newScore = Number.isNaN(newPoints) ? null : newPoints
    setDraftScores((current) => {
      const next = new Map(current)
      next.set(id, newScore)
      return next
    })
  }

  const {
    mutate: uploadZipFile,
    error: uploadZipFileError,
    isPending: uploadZipFileIsPending,
  } = useMutation({
    mutationFn: ({data, problemId}: {data: FormData; problemId?: string}) =>
      apiAxios.post(`/competition/problem/${problemId}/upload-corrected`, data),
    onSuccess: () => refetchProblem(),
  })

  const uploadZipFileErrorData =
    isAxiosError(uploadZipFileError) && uploadZipFileError.response && (uploadZipFileError.response.data as unknown)
  const uploadZipFileErrorArray = Array.isArray(uploadZipFileErrorData) ? uploadZipFileErrorData : []
  const uploadZipFileErrors = uploadZipFileErrorArray
    .map((errorObj: unknown) => {
      const error = typeof errorObj === 'object' && errorObj
      const filename = error && 'filename' in error && typeof error.filename === 'string' ? `${error.filename}: ` : ''
      const status = error && 'status' in error && typeof error.status === 'number' ? `${error.status}` : ''
      return `${filename}${status}`
    })
    .join('\n')

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return
      }
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      uploadZipFile({data: formData, problemId: problemId})
    },
    [problemId, uploadZipFile],
  )

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: Accept.Zip,
  })

  const sortedSolutions = useMemo(
    () =>
      (baseline ?? []).toSorted((left, right) => {
        if (sortKey === 'name') {
          const leftName = getSolutionName(left)
          const rightName = getSolutionName(right)
          return sortDirection === 'asc'
            ? leftName.localeCompare(rightName, 'sk')
            : rightName.localeCompare(leftName, 'sk')
        }
        const leftPoints = left.score ?? Number.NEGATIVE_INFINITY
        const rightPoints = right.score ?? Number.NEGATIVE_INFINITY
        return sortDirection === 'asc' ? leftPoints - rightPoints : rightPoints - leftPoints
      }),
    [baseline, sortKey, sortDirection],
  )

  if (permissionsIsLoading || problemIsLoading || semesterIsLoading) return <Loading />
  if (!hasPermissions) return <span>Nemáš oprávnenie na zobrazenie tejto stránky.</span>
  if (problemId === undefined || !problem)
    return <Typography>Nevalidné číslo úlohy (problemId) v URL alebo ju proste nevieme fetchnúť z BE.</Typography>

  const handleSavePoints = () => uploadPoints(problemId)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection(key === 'name' ? 'asc' : 'desc')
  }

  const getSortArrow = (key: SortKey) => (sortKey === key ? (sortDirection === 'asc' ? '↑' : '↓') : '')

  return (
    <>
      <Dialog
        open={exitDialogOpen}
        title="Neuložené zmeny"
        contentText="Máš neuložené zmeny. Naozaj chceš opustiť stránku?"
        actions={
          <>
            <Button variant="button2" onClick={continueNavigation}>
              Opustiť stránku
            </Button>
            <Button
              variant="button2"
              onClick={() => {
                setExitDialogOpen(false)
              }}
            >
              Zostať na stránke
            </Button>
          </>
        }
      />
      <Stack gap={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          <Typography variant="h2">Opravovanie {problem.order}. úlohy</Typography>

          <Link variant="button2" href={`/${seminar}/admin/opravovanie/${semesterUrl}`}>
            Späť na semester
          </Link>
        </Stack>

        <Markdown content={problem.text ?? 'Načítavam...'} />
        {problem.image && (
          <Stack alignItems="center">
            <Image
              src={problem.image}
              alt={`Obrázok - ${problem.order} úloha`}
              style={{
                width: 'auto',
                height: 'auto',
                minHeight: '3rem',
                minWidth: '3rem',
                maxHeight: '50vh',
                marginTop: '1rem',
              }}
              // width/height dava len nieco vediet nextu, ale realne sa to styluje stylmi vyssie
              width={800}
              height={800}
            />
          </Stack>
        )}

        <Stack direction="row" gap={1}>
          <Typography variant="body1" component="div">
            Vzorové riešenie:
          </Typography>
          {problem.solution_pdf ? (
            <Box component="a" href={problem.solution_pdf} target="_blank" rel="noreferrer" sx={styles.icon}>
              <FormatAlignJustify />
            </Box>
          ) : (
            <Box sx={styles.iconDisabled}>
              <FormatAlignJustify />
            </Box>
          )}
          <FileUploader
            uploadLink={`/competition/problem/${problemId}/upload-model-solution`}
            refetch={refetchProblem}
            acceptedFormats={Accept.Pdf}
          />
        </Stack>

        <Stack alignItems="end">
          <Link variant="button2" href={`/api/competition/problem/${problemId}/download-solutions`}>
            Stiahnuť riešenia
          </Link>
        </Stack>

        {uploadZipFileIsPending ? (
          <Loading />
        ) : (
          <FileDropZone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            text="Vlož opravené riešenia vo formáte zip"
          />
        )}
        {uploadZipFileError && (
          <>
            <Typography>Chyby pri nahrávaní ZIPka:</Typography>
            <Typography sx={{whiteSpace: 'pre-line'}}>{uploadZipFileErrors}</Typography>
          </>
        )}

        <Box sx={styles.table}>
          <Box sx={styles.tableHeader}>
            <Box
              component="button"
              type="button"
              onClick={() => toggleSort('name')}
              sx={{all: 'unset', cursor: 'pointer', justifySelf: 'start'}}
            >
              Riešiteľ {getSortArrow('name')}
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => toggleSort('points')}
              sx={{all: 'unset', cursor: 'pointer', placeSelf: 'center'}}
            >
              Body {getSortArrow('points')}
            </Box>
            <Box sx={styles.centerCell}>Riešenie</Box>
            <Box sx={styles.centerCell}>Opravené</Box>
          </Box>
          {sortedSolutions.map((solution) => (
            <Box key={solution.id} sx={styles.tableRow}>
              <div>
                {solution.semester_registration?.profile.first_name} {solution.semester_registration?.profile.last_name}
                {solution.late_tag ? (
                  <>
                    {' '}
                    <Tooltip title={solution.late_tag?.comment}>
                      <span>({solution.late_tag.name})</span>
                    </Tooltip>
                  </>
                ) : (
                  ''
                )}
              </div>
              <Box sx={styles.centerCell}>
                <Box
                  component="input"
                  type="text"
                  pattern="[0-9]"
                  value={displayScore(solution) ?? ''}
                  onChange={(event) => updateScore(solution.id, event.target.value)}
                  sx={{
                    ...styles.input,
                    fontWeight: dirtyIds.has(solution.id) ? 'normal' : 'bold',
                  }}
                />
              </Box>
              <Box sx={styles.centerCell}>
                {solution.solution ? (
                  <Box
                    component="a"
                    href={getSolutionUrl(solution.id)}
                    target="_blank"
                    rel="noreferrer"
                    sx={styles.icon}
                  >
                    <FormatAlignJustify />
                  </Box>
                ) : (
                  <Box sx={styles.iconDisabled}>
                    <FormatAlignJustify />
                  </Box>
                )}
                <FileUploader
                  uploadLink={`/competition/solution/${solution.id}/upload-solution-file`}
                  refetch={refetchProblem}
                  testId={`upload-solution-${solution.id}`}
                />
              </Box>
              <Box sx={styles.centerCell}>
                {solution.corrected_solution ? (
                  <Box
                    component="a"
                    href={getCorrectedSolutionUrl(solution.id)}
                    target="_blank"
                    rel="noreferrer"
                    sx={styles.icon}
                  >
                    <Grading />
                  </Box>
                ) : (
                  <Box sx={styles.iconDisabled}>
                    <Grading />
                  </Box>
                )}
                <FileUploader
                  uploadLink={`/competition/solution/${solution.id}/upload-corrected-solution-file`}
                  refetch={refetchProblem}
                  testId={`upload-corrected-${solution.id}`}
                />
              </Box>
            </Box>
          ))}
        </Box>

        <Stack alignItems="end" mt={1.5}>
          <Button variant="button2" onClick={handleSavePoints} disabled={uploadPointsIsPending || !isDirty}>
            {uploadPointsIsPending ? 'Ukladám…' : 'Uložiť body'}
          </Button>
        </Stack>
      </Stack>
    </>
  )
}

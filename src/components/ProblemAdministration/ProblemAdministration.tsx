import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {Box, Stack, Typography} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {useMutation, useQuery} from '@tanstack/react-query'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {FC, useCallback, useMemo, useState} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {apiOptions} from '@/api/api'
import {colors} from '@/theme/colors'
import {SolutionAdministration, UploadCorrectedFileIssue} from '@/types/api/competition'
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
import {getUploadSummary, parseUploadCorrectedError} from './uploadCorrected'

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

const FileIssueList: FC<{title: string; issues: UploadCorrectedFileIssue[]}> = ({title, issues}) => {
  if (issues.length === 0) return null
  return (
    <Box>
      <Typography variant="body2" fontWeight={800}>
        {title}
      </Typography>
      <Box component="ul" sx={{m: 0}}>
        {issues.map(({filename, reason}, index) => (
          <li key={`${filename}-${index}`}>
            <Typography variant="body2">
              <Box component="span" sx={{fontWeight: 'bold'}}>
                {filename}
              </Box>
              : {reason}
            </Typography>
          </li>
        ))}
      </Box>
    </Box>
  )
}

type SortKey = 'name' | 'points'

// Empty or incomplete input (e.g. a lone "-") counts as no score
const parseScore = (input: string): number | null => {
  const score = Number.parseInt(input)
  return Number.isNaN(score) ? null : score
}

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
  // Raw input text, so a "-" typed before the digit stays in the field
  const [draftScores, setDraftScores] = useState<Map<number, string>>(new Map())
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
      if (parseScore(draftScore) !== baselineScore) ids.add(id)
    }
    return ids
  }, [draftScores, baselineById])

  const isDirty = dirtyIds.size > 0

  const displayScore = (row: SolutionAdministration): string => draftScores.get(row.id) ?? row.score?.toString() ?? ''

  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const {continueNavigation} = useNavigationTrap({
    shouldBlockNavigation: isDirty,
    onNavigate: () => {
      setExitDialogOpen(true)
    },
  })

  const {mutate: uploadPoints, isPending: uploadPointsIsPending} = useMutation({
    ...apiOptions.competition.problemAdministration.uploadPoints(),
    onSuccess: () => {
      alert('Body boli úspešne uložené.')
      return refetchProblem()
    },
  })

  const updateScore = (id: number, newPointsInput: string) => {
    setDraftScores((current) => {
      const next = new Map(current)
      next.set(id, newPointsInput)
      return next
    })
  }

  const {
    mutate: uploadZipFile,
    data: uploadZipFileResult,
    error: uploadZipFileError,
    isPending: uploadZipFileIsPending,
    reset: resetUploadZipFile,
  } = useMutation({
    ...apiOptions.competition.problem.uploadCorrected(),
    onSuccess: (result) => {
      alert(getUploadSummary(result))
      return refetchProblem()
    },
  })

  const uploadZipFileErrorData = parseUploadCorrectedError(uploadZipFileError)

  const [zipRejectedMessage, setZipRejectedMessage] = useState<string | null>(null)

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        resetUploadZipFile()
        setZipRejectedMessage(
          `Súbor ${fileRejections.map(({file}) => file.name).join(', ')} sa nedá nahrať. Nahraj jeden súbor vo formáte .zip.`,
        )
        return
      }
      if (problemId === undefined || acceptedFiles.length === 0) {
        return
      }
      setZipRejectedMessage(null)
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      uploadZipFile({data: formData, problemId})
    },
    [problemId, uploadZipFile, resetUploadZipFile],
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

  const handleSavePoints = () => {
    const solutionSet = (baseline ?? []).map((row) => {
      const draftScore = draftScores.get(row.id)
      return draftScore === undefined ? row : {...row, score: parseScore(draftScore)}
    })
    uploadPoints({problemId, solutionSet})
  }

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
          <Tooltip title="Názov PDF s riešením má byť vo formáte: BODY-Meno-IDúlohy-IDregistrácie.pdf" placement="top">
            <Box>
              <FileDropZone
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                text="Vlož opravené riešenia vo formáte zip"
              />
            </Box>
          </Tooltip>
        )}
        {zipRejectedMessage && (
          <Typography variant="body2" fontWeight={800}>
            {zipRejectedMessage}
          </Typography>
        )}
        {uploadZipFileResult && (
          <Stack gap={0.5} data-testid="upload-zip-result">
            <Typography>Nahraných opravených riešení: {uploadZipFileResult.uploaded.length}.</Typography>
            <FileIssueList title="Neuložené pre chybu:" issues={uploadZipFileResult.errors} />
            <FileIssueList title="Preskočené súbory (nie sú PDF):" issues={uploadZipFileResult.skipped} />
          </Stack>
        )}
        {uploadZipFileErrorData && (
          <Stack gap={0.5} data-testid="upload-zip-errors">
            <Typography fontWeight={800}>{uploadZipFileErrorData.detail}</Typography>
            <FileIssueList title="Neuložené pre chybu:" issues={uploadZipFileErrorData.errors} />
            <FileIssueList title="Preskočené súbory (nie sú PDF):" issues={uploadZipFileErrorData.skipped} />
          </Stack>
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
                  pattern="-?[0-9]"
                  value={displayScore(solution)}
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

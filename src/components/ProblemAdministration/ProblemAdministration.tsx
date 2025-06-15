import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {Box, Stack, Typography} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {useMutation, useQuery} from '@tanstack/react-query'
import {isAxiosError} from 'axios'
import {useRouter} from 'next/router'
import React, {FC, useCallback, useEffect, useState} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {apiAxios} from '@/api/apiAxios'
import {colors} from '@/colors'
import {ProblemWithSolutions, SemesterWithProblems, SolutionAdministration} from '@/types/api/competition'
import {Accept} from '@/utils/dropzoneAccept'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useNavigationTrap} from '@/utils/useNavigationTrap'

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

export const ProblemAdministration: FC = () => {
  const router = useRouter()
  const {params} = router.query
  const {setPageTitle} = PageTitleContainer.useContainer()

  const problemId = params && params[0]

  const [isDirty, setIsDirty] = useState(false)

  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const {continueNavigation} = useNavigationTrap({
    shouldBlockNavigation: isDirty,
    onNavigate: () => {
      setExitDialogOpen(true)
    },
  })

  const {
    data: problemData,
    refetch: refetchProblem,
    isLoading: problemIsLoading,
  } = useQuery({
    queryKey: ['competition', 'problem-administration', problemId],
    queryFn: () => apiAxios.get<ProblemWithSolutions>(`/competition/problem-administration/${problemId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym problemId
    enabled: problemId !== undefined,
  })
  const problem = problemData?.data

  const semesterId = problem?.series.semester
  const {data: semesterData, isLoading: semesterIsLoading} = useQuery({
    queryKey: ['competition', 'semester', semesterId],
    queryFn: () => apiAxios.get<SemesterWithProblems>(`/competition/semester/${semesterId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym semesterId
    enabled: semesterId !== undefined,
  })
  const semester = semesterData?.data
  const semesterName = semester?.season_code === 0 ? 'zima' : 'leto'
  const semesterUrl = `${semester?.year}/${semesterName}`

  useEffect(() => {
    if (!!problem && !!semester)
      setPageTitle(
        `${problem?.order}. úloha - ${problem?.series.order}. séria - ${semesterUrl} (${semester?.school_year})`,
      )
  }, [problem, semester, semesterUrl, setPageTitle])

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  const [solutions, setSolutions] = useState<SolutionAdministration[]>()

  useEffect(() => {
    // TODO: asi to nechceme updatovat vzdy pri zmene dat zo serveru, moze nam to prepisovat lokalny stav...
    // netreba robit novy array, podstatne je spravne ohandlit zmeny
    if (problem) setSolutions(problem.solution_set)
  }, [problem])

  const {mutate: uploadPoints} = useMutation({
    mutationFn: (id: string) =>
      apiAxios.post(`/competition/problem-administration/${id}/upload-points`, {
        solution_set: solutions,
      }),
    onSuccess: () => refetchProblem(),
  })

  const updatePoints = (index: number, newPointsInput: string) => {
    const newPoints = Number.parseInt(newPointsInput)
    // nevalidny input spravi NaN
    const newScore = Number.isNaN(newPoints) ? null : newPoints
    // array v javascripte je objekt s referenciou, pre skopirovanie odpojene od originalneho objektu treba vytvorit novy array
    const data = [...(solutions ?? [])]
    // nie je to ale "deep copy" - data[index] je tiez referencia na povodny objekt, treba ho skopirovat
    data[index] = {...data[index], score: newScore}
    setSolutions(data)
    setIsDirty(true)
  }

  const updateSolution = (index: number) => {
    // array v javascripte je objekt s referenciou, pre skopirovanie odpojene od originalneho objektu treba vytvorit novy array
    const data = [...(solutions ?? [])]
    // nie je to ale "deep copy" - data[index] je tiez referencia na povodny objekt, treba ho skopirovat
    data[index] = {...data[index], solution: 'uploaded'}
    setSolutions(data)
  }

  const updateCorrectedSolution = (index: number) => {
    // array v javascripte je objekt s referenciou, pre skopirovanie odpojene od originalneho objektu treba vytvorit novy array
    const data = [...(solutions ?? [])]
    // nie je to ale "deep copy" - data[index] je tiez referencia na povodny objekt, treba ho skopirovat
    data[index] = {...data[index], corrected_solution: 'uploaded'}
    setSolutions(data)
  }

  const {mutate: uploadZipFile, error: uploadZipFileError} = useMutation({
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

  if (permissionsIsLoading || problemIsLoading || semesterIsLoading) return <Loading />
  if (!hasPermissions) return <span>Nemáš oprávnenie na zobrazenie tejto stránky.</span>
  if (problemId === undefined || !problem)
    return <Typography>Nevalidné číslo úlohy (problemId) v URL alebo ju proste nevieme fetchnúť z BE.</Typography>

  const handleSavePoints = () => {
    setIsDirty(false)
    uploadPoints(problemId)
  }

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

          <Link variant="button2" href={`/strom/admin/opravovanie/${semesterUrl}`}>
            Späť na semester
          </Link>
        </Stack>

        <Markdown content={problem.text ?? 'Načítavam...'} />

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
          />
        </Stack>

        <Stack alignItems="end">
          <Link variant="button2" href={`/api/competition/problem/${problemId}/download-solutions`}>
            Stiahnuť riešenia
          </Link>
        </Stack>

        <FileDropZone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          text="Vlož opravené riešenia vo formáte zip"
        />
        {uploadZipFileError && (
          <>
            <Typography>Chyby pri nahrávaní ZIPka:</Typography>
            <Typography sx={{whiteSpace: 'pre-line'}}>{uploadZipFileErrors}</Typography>
          </>
        )}

        <Box sx={styles.table}>
          <Box sx={styles.tableHeader}>
            <div>Riešiteľ</div>
            <Box sx={styles.centerCell}>Body</Box>
            <Box sx={styles.centerCell}>Riešenie</Box>
            <Box sx={styles.centerCell}>Opravené</Box>
          </Box>
          {solutions?.map((solution, index) => (
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
                  value={solution.score ?? ''}
                  onChange={(event) => updatePoints(index, event.target.value)}
                  sx={styles.input}
                />
              </Box>
              <Box sx={styles.centerCell}>
                {solution.solution ? (
                  <Box
                    component="a"
                    href={`/api/competition/solution/${solution.id}/file-solution`}
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
                  refetch={() => updateSolution(index)}
                />
              </Box>
              <Box sx={styles.centerCell}>
                {solution.corrected_solution ? (
                  <Box
                    component="a"
                    href={`/api/competition/solution/${solution.id}/file-corrected`}
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
                  refetch={() => updateCorrectedSolution(index)}
                />
              </Box>
            </Box>
          ))}
        </Box>

        <Stack alignItems="end" mt={1.5}>
          <Button variant="button2" onClick={handleSavePoints}>
            Uložiť body
          </Button>
        </Stack>
      </Stack>
    </>
  )
}

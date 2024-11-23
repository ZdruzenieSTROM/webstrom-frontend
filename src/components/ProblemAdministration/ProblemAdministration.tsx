import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {Stack, Typography} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import axios, {isAxiosError} from 'axios'
import {useRouter} from 'next/router'
import React, {FC, useCallback, useEffect, useState} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {ProblemWithSolutions, SemesterWithProblems, SolutionAdministration} from '@/types/api/competition'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {useHasPermissions} from '@/utils/useHasPermissions'
import {useNavigationTrap} from '@/utils/useNavigationTrap'

import {Button} from '../Clickable/Button'
import {Link} from '../Clickable/Link'
import {Dialog} from '../Dialog/Dialog'
import {FileDropZone} from '../FileDropZone/FileDropZone'
import {FileUploader} from '../FileUploader/FileUploader'
import {Latex} from '../Latex/Latex'
import {Loading} from '../Loading/Loading'
import styles from './ProblemAdministration.module.scss'

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
    queryFn: () => axios.get<ProblemWithSolutions>(`/api/competition/problem-administration/${problemId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym problemId
    enabled: problemId !== undefined,
  })
  const problem = problemData?.data

  const semesterId = problem?.series.semester
  const {data: semesterData, isLoading: semesterIsLoading} = useQuery({
    queryKey: ['competition', 'semester', semesterId],
    queryFn: () => axios.get<SemesterWithProblems>(`/api/competition/semester/${semesterId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym semesterId
    enabled: semesterId !== undefined,
  })
  const semester = semesterData?.data
  const semesterName = semester?.season_code === 0 ? 'zima' : 'leto'
  const semesterUrl = `${semester?.year}/${semesterName}`

  useEffect(() => {
    !!problem && !!semester && setPageTitle(`${problem?.order}. úloha - ${semesterUrl} (${semester?.school_year})`)
  }, [problem, semester, semesterUrl, setPageTitle])

  const {hasPermissions, permissionsIsLoading} = useHasPermissions()

  const [solutions, setSolutions] = useState<SolutionAdministration[]>()

  useEffect(() => {
    // TODO: asi to nechceme updatovat vzdy pri zmene dat zo serveru, moze nam to prepisovat lokalny stav...
    // netreba robit novy array, podstatne je spravne ohandlit zmeny
    if (problem) setSolutions(problem.solution_set)
  }, [problem])

  const {mutate: uploadPoints} = useMutation({
    mutationFn: (id: string) => {
      return axios.post(`/api/competition/problem-administration/${id}/upload-points`, {
        solution_set: solutions,
      })
    },
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
      axios.post(`/api/competition/problem/${problemId}/upload-corrected`, data),
    onSuccess: () => refetchProblem(),
  })

  const uploadZipFileErrorData =
    isAxiosError(uploadZipFileError) && uploadZipFileError.response && uploadZipFileError.response.data
  const uploadZipFileErrorArray = Array.isArray(uploadZipFileErrorData) ? uploadZipFileErrorData : []
  const uploadZipFileErrors = uploadZipFileErrorArray
    .map((errorObj) => {
      const filename = 'filename' in errorObj ? `${errorObj.filename}: ` : ''
      const status = 'status' in errorObj ? `${errorObj.status}` : ''
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
    accept: {
      'application/zip': ['.zip'],
    },
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
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h2">Opravovanie {problem.order}. úlohy</Typography>

          <Link variant="button2" href={`/strom/admin/opravovanie/${semesterUrl}`}>
            Späť na semester
          </Link>
        </Stack>

        <Latex>{problem.text ?? 'Načítavam...'}</Latex>

        <div className={styles.row}>
          <Typography variant="body1" component="div">
            Vzorové riešenie:
          </Typography>
          {problem.solution_pdf ? (
            <a href={problem.solution_pdf} target="_blank" rel="noreferrer" className={styles.icon}>
              <FormatAlignJustify />
            </a>
          ) : (
            <div className={styles.iconDisabled}>
              <FormatAlignJustify />
            </div>
          )}
          <FileUploader
            uploadLink={`/api/competition/problem/${problemId}/upload-model-solution`}
            refetch={refetchProblem}
          />
        </div>

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

        <form>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Riešiteľ</div>
              <div className={styles.centerCell}>Body</div>
              <div className={styles.centerCell}>Riešenie</div>
              <div className={styles.centerCell}>Opravené</div>
            </div>
            {solutions?.map((solution, index) => (
              <div key={solution.id} className={styles.tableRow}>
                <div>
                  {solution.semester_registration?.profile.first_name}{' '}
                  {solution.semester_registration?.profile.last_name}
                </div>
                <div className={styles.centerCell}>
                  <input
                    type="text"
                    pattern="[0-9]"
                    value={solution.score ?? ''}
                    onChange={(event) => updatePoints(index, event.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.centerCell}>
                  {solution.solution ? (
                    <a
                      href={`/api/competition/solution/${solution.id}/file-solution`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.icon}
                    >
                      <FormatAlignJustify />
                    </a>
                  ) : (
                    <div className={styles.iconDisabled}>
                      <FormatAlignJustify />
                    </div>
                  )}
                  <FileUploader
                    uploadLink={`/api/competition/solution/${solution.id}/upload-solution-file`}
                    refetch={() => updateSolution(index)}
                  />
                </div>
                <div className={styles.centerCell}>
                  {solution.corrected_solution ? (
                    <a
                      href={`/api/competition/solution/${solution.id}/file-corrected`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.icon}
                    >
                      <Grading />
                    </a>
                  ) : (
                    <div className={styles.iconDisabled}>
                      <Grading />
                    </div>
                  )}
                  <FileUploader
                    uploadLink={`/api/competition/solution/${solution.id}/upload-corrected-solution-file`}
                    refetch={() => updateCorrectedSolution(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Stack alignItems="end" mt={1.5}>
            <Button variant="button2" onClick={handleSavePoints}>
              Uložiť body
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  )
}

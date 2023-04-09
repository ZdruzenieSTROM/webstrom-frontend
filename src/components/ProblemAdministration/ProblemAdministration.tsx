import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import React, {FC, useCallback, useEffect, useState} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {ProblemWithSolutions, SolutionAdministration} from '@/types/api/competition'

import {Button, FileUploader, Link} from '../Clickable/Clickable'
import {Latex} from '../Latex/Latex'
import styles from '../Problems/Problems.module.scss'
import uploadProblemFormStyles from '../Problems/UploadProblemForm.module.scss'

export const ProblemAdministration: FC = () => {
  const router = useRouter()
  const {params} = router.query

  const problemId = params && params[0]

  const {data: problemData, remove: removeCachedProblem} = useQuery({
    queryKey: ['competition', 'problem-administration', problemId],
    queryFn: () => axios.get<ProblemWithSolutions>(`/api/competition/problem-administration/${problemId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym problemId
    enabled: problemId !== undefined,
  })

  const problem = problemData?.data

  const [solutions, setSolutions] = useState<SolutionAdministration[]>()

  useEffect(() => {
    setSolutions(problem?.solution_set)
  }, [problem])

  const handleSavePoints = () => {
    const data = problem?.solution_set
    axios.post(`/api/competition/problem-administration/${problemId}/upload-points`, {
      solution_set: data,
    })
    setSolutions(data)
    removeCachedProblem()
  }
  const updatePoints = (index: number, newPoints: number) => {
    const data = [...(solutions ?? [])]
    data[index].score = newPoints
    setSolutions(data)
  }

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles) => {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      axios.post(`/competition/problem/${problemId}/corrected-solution`, formData)
      removeCachedProblem()
    },
    [problemId, removeCachedProblem],
  )

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <>
      <h2>Opravovanie {problem?.order}. úlohy</h2>
      <Link href={`/strom/opravovanie/${problem?.series.semester}`}>Späť na semester</Link>
      <Latex>{problem?.text ?? 'Načítavam...'}</Latex>
      <div className={styles.actions}>
        <Link href={`/api/competition/problem/${problemId}/download-solutions`}>Stiahnuť riešenia</Link>
      </div>
      <div {...getRootProps({className: uploadProblemFormStyles.dropzone})}>
        <input {...getInputProps()} />
        <p>Vlož opravené riešenia</p>
      </div>
      <form>
        <div>
          Opravovatelia: <input type="text" />
        </div>
        <div>
          Najkrajšie riešenia:
          <input type="text" />
        </div>

        <table>
          <tbody>
            <tr>
              <th>Riešiteľ</th>
              <th>Body</th>
              <th>Riešenie</th>
              <th>Opravené</th>
            </tr>
            {solutions?.map((solution, index) => (
              <tr key={solution.id}>
                <td>
                  {solution.semester_registration?.profile.first_name}{' '}
                  {solution.semester_registration?.profile.last_name}
                </td>
                <td>
                  <input
                    type="text"
                    pattern="[0-9]"
                    value={solution.score ?? ''}
                    onChange={(event) => updatePoints(index, Number.parseInt(event.target.value))}
                  />
                </td>
                <td>
                  {solution.solution ? (
                    <a href={solution?.solution} target="_blank" rel="noreferrer">
                      <FormatAlignJustify />
                    </a>
                  ) : (
                    <FileUploader
                      uploadLink={`/api/competition/solution/${solution.id}/upload-solution-file`}
                      removeCache={removeCachedProblem}
                    />
                  )}
                </td>
                <td>
                  {solution.corrected_solution ? (
                    <a href={solution?.corrected_solution} target="_blank" rel="noreferrer">
                      <Grading />
                    </a>
                  ) : (
                    <FileUploader
                      uploadLink={`/api/competition/solution/${solution.id}/upload-corrected-solution-file`}
                      removeCache={removeCachedProblem}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button onClick={handleSavePoints}>Uložiť body</Button>
      </form>
    </>
  )
}

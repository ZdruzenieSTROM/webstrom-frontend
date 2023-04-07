import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import React, {FC, useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'

import {ProblemWithSolutions} from '@/types/api/competition'

import {Button, FileUploader, Link} from '../Clickable/Clickable'
import {Latex} from '../Latex/Latex'
import styles from '../Problems/Problems.module.scss'

export const ProblemAdministration: FC = () => {
  const router = useRouter()
  const {params} = router.query
  const [problemId, setProblemId] = useState(params ? params[0] : 1)
  useEffect(() => {
    const {params} = router.query
    setProblemId(params ? params[0] : 1)
  }, [router.query])
  const {data: problemData, remove: removeCachedProblem} = useQuery({
    queryKey: ['competition', 'problem-administration', problemId],
    queryFn: () => axios.get<ProblemWithSolutions>(`/api/competition/problem-administration/${problemId}/`),
  })
  const [solutions, setSolutions] = useState(problemData?.data?.solution_set)

  useEffect(() => {
    setSolutions(problemData?.data?.solution_set)
  }, [problemData])

  const handleSavePoints = () => {
    const data = problemData?.data?.solution_set
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

  const onDrop = useCallback(
    (acceptedFiles) => {
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      axios.post(`/competition/problem/${problemId}/corrected-solution/`, formData)
      removeCachedProblem()
    },
    [problemId, removeCachedProblem],
  )

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <>
      <h2>Opravovanie {problemData?.data?.order}. úlohy</h2>
      <Link href={`/strom/opravovanie/${problemData?.data.series.semester}`}>Späť na semester</Link>
      <Latex>{problemData?.data?.text ?? 'Načítavam...'}</Latex>
      <div className={styles.actions}>
        <Link href={`/api/competition/problem/${problemId}/download-solutions/`}>Stiahnuť riešenia</Link>
      </div>
      <div {...getRootProps({className: styles.dropzone})}>
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
            {solutions?.map((solution, index) => {
              return (
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
              )
            })}
          </tbody>
        </table>
        <Button onClick={handleSavePoints}>Uložiť body</Button>
      </form>
    </>
  )
}

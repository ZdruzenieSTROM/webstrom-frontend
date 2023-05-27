import {FormatAlignJustify, Grading} from '@mui/icons-material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {useRouter} from 'next/router'
import React, {FC, useCallback, useEffect, useState} from 'react'
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import {ProblemWithSolutions, SolutionAdministration} from '@/types/api/competition'

import {Button, Link} from '../Clickable/Clickable'
import {FileUploader} from '../FileUploader/FileUploader'
import {Latex} from '../Latex/Latex'
import problemStyles from '../Problems/Problems.module.scss'
import uploadProblemFormStyles from '../Problems/UploadProblemForm.module.scss'
import styles from './ProblemAdministration.module.scss'

export const ProblemAdministration: FC = () => {
  const router = useRouter()
  const {params} = router.query

  const problemId = params && params[0]

  const {data: problemData, refetch: refetchProblem} = useQuery({
    queryKey: ['competition', 'problem-administration', problemId],
    queryFn: () => axios.get<ProblemWithSolutions>(`/api/competition/problem-administration/${problemId}`),
    // router.query.params su v prvom renderi undefined, tak pustime query az so spravnym problemId
    enabled: problemId !== undefined,
  })

  const problem = problemData?.data

  const [solutions, setSolutions] = useState<SolutionAdministration[]>()

  useEffect(() => {
    // TODO: asi to nechceme updatovat vzdy pri zmene dat zo serveru, moze nam to prepisovat lokalny stav...
    // netreba robit novy array, podstatne je spravne ohandlit zmeny
    if (problem) setSolutions(problem.solution_set)
  }, [problem])

  const handleSavePoints = async () => {
    // TODO: error handling - ked toto failne, urcite chceme ukazat, ze bacha, body neboli ulozene
    await axios.post(`/api/competition/problem-administration/${problemId}/upload-points`, {
      solution_set: solutions,
    })
    // TODO: pri errore POSTu vyssie nechceme pustit refetch (alebo nechceme bezat useEffect), lebo sa nam prepisu lokalne body
    await refetchProblem()
  }

  const updatePoints = (index: number, newPointsInput: string) => {
    const newPoints = Number.parseInt(newPointsInput)
    // nevalidny input spravi NaN
    const newScore = Number.isNaN(newPoints) ? null : newPoints
    // array v javascripte je objekt s referenciou, pre skopirovanie odpojene od originalneho objektu treba vytvorit novy array
    const data = [...(solutions ?? [])]
    // nie je to ale "deep copy" - data[index] je tiez referencia na povodny objekt, treba ho skopirovat
    data[index] = {...data[index], score: newScore}
    setSolutions(data)
  }

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        return
      }
      const formData = new FormData()
      formData.append('file', acceptedFiles[0])
      await axios.post(`/api/competition/problem/${problemId}/upload-corrected`, formData)
      await refetchProblem()
    },
    [problemId, refetchProblem],
  )

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/zip': ['.zip'],
    },
  })

  return (
    <>
      <h2>Opravovanie {problem?.order}. úlohy</h2>
      <Link href={`/strom/admin/opravovanie/${problem?.series.semester}`}>Späť na semester</Link>
      <Latex>{problem?.text ?? 'Načítavam...'}</Latex>
      <div className={problemStyles.actions}>
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
                    onChange={(event) => updatePoints(index, event.target.value)}
                  />
                </td>
                <td>
                  <div className={styles.buttonsCell}>
                    {solution.solution && (
                      <a href={solution?.solution} target="_blank" rel="noreferrer" className={styles.icon}>
                        <FormatAlignJustify />
                      </a>
                    )}
                    <FileUploader
                      uploadLink={`/api/competition/solution/${solution.id}/upload-solution-file`}
                      refetch={refetchProblem}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.buttonsCell}>
                    {solution.corrected_solution && (
                      <a href={solution?.corrected_solution} target="_blank" rel="noreferrer" className={styles.icon}>
                        <Grading />
                      </a>
                    )}
                    <FileUploader
                      uploadLink={`/api/competition/solution/${solution.id}/upload-corrected-solution-file`}
                      refetch={refetchProblem}
                    />
                  </div>
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

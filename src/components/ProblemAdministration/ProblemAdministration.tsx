import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import {useRouter} from 'next/router'
import {createRef, FC, Fragment, useEffect, useState} from 'react'
import {FormInput} from 'react-admin'

import {ProblemWithSolutions, SolutionAdministration} from '@/types/api/competition'

import {Button, Link} from '../Clickable/Clickable'
import {Latex} from '../Latex/Latex'
import styles from '../Problems/Problems.module.scss'

export const ProblemAdministration: FC<{problemId: number}> = ({problemId}) => {
  const {data: problemData, isLoading: problemIsLoading, remove: removeCachedProblem} = useQuery(
    ['competition', 'problem-administration', problemId],
    () => axios.get<ProblemWithSolutions>(`/api/competition/problem-administration/${problemId}/`),
  )
  const [solutions, setSolutions] = useState(problemData?.data?.solution_set)

  useEffect(() => {
    setSolutions(problemData?.data?.solution_set)
  }, [problemData])
  // const handleZipSubmit = async () => {
  //   const formData = new FormData()
  //   formData.append('file', acceptedFiles[0])

  //   try {
  //     const response = await axios.post(`/api/competition/problem/${problemId}/upload-corrected/`, formData)
  //     if (response.status === 201) {
  //       console.log('file uploaded') // ToDo: remove log() and let user know the response! message system? or something else?
  //     }
  //   } catch (e: unknown) {
  //     const ex = e as AxiosError
  //     const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
  //   }
  // }

  const handleSavePoints = () => {
    const data = problemData?.data?.solution_set
    const response = axios.post(`/api/competition/problem-administration/${problemId}/upload-points`, {
      solution_set: data,
    })
    removeCachedProblem()
    setSolutions(data)
  }
  const updatePoints = (index: number, newPoints: number) => {
    const data = [...(solutions ?? [])]
    data[index].score = newPoints
    setSolutions(data)
  }

  return (
    <>
      <h2>Opravovanie {problemData?.data?.order}. úlohy</h2>
      <Latex>{problemData?.data?.text ?? 'Načítavam...'}</Latex>
      <div className={styles.actions}>
        <Button>Nahrať opravené riešenia</Button>
        <Link href={`/api/competition/problem/${problemId}/download-solutions/`}>Stiahnuť riešenia</Link>
      </div>
      <div>Opravovatelia: </div>
      <div>Najkrajšie riešenia:</div>
      <form>
        <table>
          <tr>
            <th>Riešiteľ</th>
            <th>Body</th>
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
              </tr>
            )
          })}
        </table>
        <Button onClick={handleSavePoints}>Uložiť body</Button>
      </form>
    </>
  )
}

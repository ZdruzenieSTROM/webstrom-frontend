import axios, {AxiosError} from 'axios'
import clsx from 'clsx'
import {useRouter} from 'next/router'
import {createRef, FC, Fragment, useEffect, useState} from 'react'
import {FormInput} from 'react-admin'

import {ProblemWithSolutions} from '@/types/api/generated/competition'

import {Latex} from '../Latex/Latex'
import styles from '../Problems/Problems.module.scss'

export const ProblemAdministration: FC<{problemId: number}> = ({problemId}) => {
  const [problem, setProblem] = useState<ProblemWithSolutions>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<ProblemWithSolutions>(`/api/competition/problem-administration/${problemId}/`)
        setProblem(data)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      }
    }
    fetchData()
  })

  const handleZipSubmit = async () => {
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    try {
      const response = await axios.post(`/api/competition/problem/${problemId}/upload-corrected/`, formData)
      if (response.status === 201) {
        console.log('file uploaded') // ToDo: remove log() and let user know the response! message system? or something else?
      }
    } catch (e: unknown) {
      const ex = e as AxiosError
      const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
    }
  }

  const handleSavePoints = async () => {
    const data = {}
    const response = await axios.post(`/api/competition/problem-administration/${problemId}/upload-points`, data)
  }

  return (
    <>
      <h2>Opravovanie {problem?.order} úlohy</h2>
      <Latex>{problem?.text ?? 'Načítavam...'}</Latex>
      <a className={styles.actionButton} href={`/api/competition/problem/${problemId}/download-solutions/`}>
        Stiahnuť riešenia
      </a>
      <div>Opravovatelia: </div>
      <div>Najkrajšie riešenia:</div>

      <table>
        <tr>
          <th>Riešiteľ</th>
          <th>Body</th>
        </tr>
        {problem?.solution_set.map((solution) => {
          return (
            <tr key={solution.id}>
              <td>
                {solution.semester_registration?.profile.first_name} {solution.semester_registration?.profile.last_name}
              </td>
              <td>
                <input type="text" pattern="[0-9]" value={solution.score ?? ''} />
              </td>
            </tr>
          )
        })}
      </table>
      <button type="submit" className={styles.actionButton} onClick={handleSavePoints}>
        Uložiť body
      </button>
    </>
  )
}

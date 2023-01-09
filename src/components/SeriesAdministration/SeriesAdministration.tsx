import axios, {AxiosError} from 'axios'
import {FC, useEffect, useState} from 'react'

import {SeriesWithProblems} from '@/types/api/generated/competition'

import {Link} from '../Clickable/Clickable'

export const SeriesAdministration: FC<{seriesIdInitial: number}> = ({seriesIdInitial}) => {
  const [seriesId, setSeriesId] = useState(seriesIdInitial)
  const [seriesData, setSeriesData] = useState<SeriesWithProblems>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get<SeriesWithProblems>('/api/competition/series/' + seriesId)
        setSeriesData(data)
      } catch (e: unknown) {
        const ex = e as AxiosError
        const error = ex.response?.status === 404 ? 'Resource not found' : 'An unexpected error has occurred'
      }
    }
    fetchData()
  }, [seriesId])
  return (
    <>
      <h2>{seriesData?.id}</h2>
      Toto je na opravovanie
      <div>
        {seriesData?.problems.map((problem) => {
          return (
            <>
              Úloha {problem.order}
              <Link href={`../opravit-ulohu/${problem.id}`} />
            </>
          )
        })}
      </div>
    </>
  )
}

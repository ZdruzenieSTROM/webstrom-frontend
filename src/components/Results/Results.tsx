import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {useDataFromURL} from '@/utils/useDataFromURL'

import {Loading} from '../Loading/Loading'
import styles from './Results.module.scss'
import {Result, ResultsRow} from './ResultsRow'

export const Results: FC = () => {
  const {id, displayWholeSemesterOnResults} = useDataFromURL()

  const competitionEndpoint = displayWholeSemesterOnResults ? 'semester' : 'series'
  const idForEndpoint = displayWholeSemesterOnResults ? id.semesterId : id.seriesId

  const {data: resultsData, isLoading: resultsIsLoading} = useQuery({
    queryKey: ['competition', competitionEndpoint, idForEndpoint, 'results'],
    queryFn: () => axios.get<Result[]>(`/api/competition/${competitionEndpoint}/${idForEndpoint}/results`),
    enabled: id.semesterId !== -1 || id.seriesId !== -1,
  })
  const results = resultsData?.data ?? []

  return (
    <div>
      {resultsIsLoading && <Loading />}
      <div className={styles.results}>
        {results.map((result, index) => (
          <ResultsRow result={result} key={index} />
        ))}
      </div>
    </div>
  )
}

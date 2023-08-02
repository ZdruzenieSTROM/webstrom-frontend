import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC} from 'react'

import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'
import {useDataFromURL} from '@/utils/useDataFromURL'

import {Loading} from '../Loading/Loading'
import styles from './Results.module.scss'
import {Result, ResultsRow} from './ResultsRow'

export const Results: FC = () => {
  const {id, displayWholeSemesterOnResults, semesterList} = useDataFromURL()

  const {data: resultsData, isLoading: resultsIsLoading} = useQuery({
    queryKey: [
      'competition',
      displayWholeSemesterOnResults ? 'semester/' : 'series/',
      displayWholeSemesterOnResults ? id.semesterId : id.seriesId,
      'results',
    ],
    queryFn: () =>
      axios.get<Result[]>(
        `/api/competition/${displayWholeSemesterOnResults ? 'semester/' : 'series/'}${
          displayWholeSemesterOnResults ? id.semesterId : id.seriesId
        }/results`,
      ),
    enabled: id.semesterId !== -1 || id.seriesId !== -1,
  })
  const results = resultsData?.data ?? []

  return (
    <div>
      {resultsIsLoading && <Loading />}
      <SemesterPicker
        semesterList={semesterList}
        selectedItem={{semesterId: id.semesterId, seriesId: id.seriesId}}
        page={'results'}
        displayWholeSemesterOption={displayWholeSemesterOnResults}
      />
      <div className={styles.results}>
        {results.map((result, index) => (
          <ResultsRow result={result} key={index} />
        ))}
      </div>
    </div>
  )
}

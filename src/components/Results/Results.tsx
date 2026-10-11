import {Box, Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'

import {apiOptions} from '@/api/api'
import {useDataFromURL} from '@/utils/useDataFromURL'

import {Loading} from '../Loading/Loading'
import {ResultsRow} from './ResultsRow'

export const Results: FC = () => {
  const {id, displayWholeSemesterOnResults} = useDataFromURL()

  const resultsQuery = displayWholeSemesterOnResults
    ? apiOptions.competition.semester.results(id.semesterId)
    : apiOptions.competition.series.results.list(id.seriesId)

  const {data: resultsData, isLoading: resultsIsLoading} = useQuery(resultsQuery)
  const results = resultsData ?? []

  return (
    <>
      {resultsIsLoading && <Loading />}
      {results.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            rowGap: {xs: '6px', sm: '10px'},
            mx: {xs: 1, sm: 3, md: 'auto'},
            gridTemplateColumns: 'max-content 1fr repeat(3, max-content)',
          }}
        >
          {results.map((result, index) => (
            <ResultsRow result={result} key={index} />
          ))}
        </Box>
      ) : (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
          <Typography variant="body1" textAlign="center">
            Toto poradie ešte nemá žiadnych riešiteľov
          </Typography>
        </Box>
      )}
    </>
  )
}

import {Box} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {FC, useEffect} from 'react'

import {BannerContainer} from '@/utils/BannerContainer'
import {useDataFromURL} from '@/utils/useDataFromURL'

import {Loading} from '../Loading/Loading'
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
  const {setBannerMessages} = BannerContainer.useContainer()
  const {data: bannerMessage, isLoading: isBannerLoading} = useQuery({
    queryKey: ['cms', 'info-banner', 'series-results', id.seriesId],
    queryFn: () => axios.get<string[]>(`/api/cms/info-banner/series-results/${id.seriesId}`),
    enabled: id.seriesId !== -1,
  })

  const bannerMessages = bannerMessage?.data
  useEffect(() => {
    if (isBannerLoading || bannerMessages === undefined) setBannerMessages([])
    else setBannerMessages(bannerMessages)
  }, [setBannerMessages, isBannerLoading, bannerMessages])

  return (
    <>
      {resultsIsLoading && <Loading />}
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
    </>
  )
}

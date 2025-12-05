import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions, createSSRApiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Results} from '@/components/Results/Results'
import {getDataFromUrl, useDataFromURL} from '@/utils/useDataFromURL'
import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

// z nazvu suboru `[[...params]]` - vzdy to musi byt string[]
const PARAM = 'params'

const Poradie: NextPage = () => {
  const {id} = useDataFromURL()

  const {data: bannerMessages} = useQuery(apiOptions.cms.infoBanner.seriesResults(id.seriesId))

  return (
    <PageLayout contentWidth={2} sx={{px: 0}} title="Poradie" bannerMessages={bannerMessages}>
      <Results />
    </PageLayout>
  )
}

export default Poradie

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, query, req}) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  const ssrApiOptions = createSSRApiOptions(req)

  const queryClient = new QueryClient()

  const [currentSeries, semesterList] = await Promise.all([
    // queries for `useDataFromURL()`
    queryClient.fetchQuery(ssrApiOptions.competition.series.current(seminarId)).catch(() => undefined),
    queryClient.fetchQuery(ssrApiOptions.competition.semesterList(seminarId)),
    ...commonQueries(queryClient, resolvedUrl, req),
  ])

  const params = query[PARAM]
  const {displayWholeSemesterOnResults, id} = getDataFromUrl({
    semesterList,
    currentSeriesData: currentSeries,
    params,
  })

  const competitionEndpoint = displayWholeSemesterOnResults ? 'semester' : 'series'
  const idForEndpoint = displayWholeSemesterOnResults ? id.semesterId : id.seriesId

  const seriesResultsQuery = ssrApiOptions.cms.infoBanner.seriesResults(id.seriesId)
  const competitionResultsQuery = ssrApiOptions.competition[competitionEndpoint].results(idForEndpoint)

  if (seriesResultsQuery.enabled && competitionResultsQuery.enabled) {
    await Promise.all([
      queryClient.prefetchQuery(seriesResultsQuery),
      queryClient.prefetchQuery(competitionResultsQuery),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

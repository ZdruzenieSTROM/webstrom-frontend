import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions} from '@/api/api'
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

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, query}) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  const queryClient = new QueryClient()

  const [currentSeries] = await Promise.all([
    // queries for `useDataFromURL()`
    queryClient.fetchQuery(apiOptions.competition.series.current(seminarId)).catch(() => undefined),
    queryClient.prefetchQuery(apiOptions.competition.semesterList(seminarId)),
    ...commonQueries(queryClient, resolvedUrl),
  ])

  const params = query[PARAM]
  const {displayWholeSemesterOnResults, id} = getDataFromUrl({
    semesterList: await queryClient.fetchQuery(apiOptions.competition.semesterList(seminarId)),
    currentSeriesData: currentSeries,
    params,
  })

  const competitionEndpoint = displayWholeSemesterOnResults ? 'semester' : 'series'
  const idForEndpoint = displayWholeSemesterOnResults ? id.semesterId : id.seriesId

  if (id.seriesId !== -1 && id.semesterId !== -1) {
    await Promise.all([
      queryClient.prefetchQuery(apiOptions.cms.infoBanner.seriesResults(id.seriesId)),
      queryClient.prefetchQuery(apiOptions.competition[competitionEndpoint].results(idForEndpoint)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

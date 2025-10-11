import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions, createSSRApiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'
import {getDataFromUrl, useDataFromURL} from '@/utils/useDataFromURL'
import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

// z nazvu suboru `[[...params]]` - vzdy to musi byt string[]
const PARAM = 'params'

const Zadania: NextPage = () => {
  const {id} = useDataFromURL()

  const {data: bannerMessages} = useQuery(apiOptions.cms.infoBanner.seriesProblems(id.seriesId))

  return (
    <PageLayout contentWidth={2} title="Zadania" bannerMessages={bannerMessages}>
      <Problems />
    </PageLayout>
  )
}

export default Zadania

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, query, req}) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  const ssrApiOptions = createSSRApiOptions(req)

  const queryClient = new QueryClient()

  const [currentSeries] = await Promise.all([
    // queries for `useDataFromURL()`
    queryClient.fetchQuery(ssrApiOptions.competition.series.current(seminarId)).catch(() => undefined),
    queryClient.prefetchQuery(ssrApiOptions.competition.semesterList(seminarId)),
    ...commonQueries(queryClient, resolvedUrl, req),
  ])

  const params = query[PARAM]
  const {id} = getDataFromUrl({
    semesterList: await queryClient.fetchQuery(ssrApiOptions.competition.semesterList(seminarId)),
    currentSeriesData: currentSeries,
    params,
  })

  const seriesQuery = ssrApiOptions.competition.series.byId(id.seriesId)
  const seriesProblemsQuery = ssrApiOptions.cms.infoBanner.seriesProblems(id.seriesId)

  if (seriesProblemsQuery.enabled && seriesQuery.enabled) {
    await Promise.all([queryClient.prefetchQuery(seriesQuery), queryClient.prefetchQuery(seriesProblemsQuery)])
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions} from '@/api/api'
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
  const {id} = getDataFromUrl({
    semesterList: await queryClient.fetchQuery(apiOptions.competition.semesterList(seminarId)),
    currentSeriesData: currentSeries,
    params,
  })

  if (id.seriesId) {
    await Promise.all([
      queryClient.prefetchQuery(apiOptions.competition.series.byId(id.seriesId)),
      queryClient.prefetchQuery(apiOptions.cms.infoBanner.seriesProblems(id.seriesId)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'
import {useDataFromURL} from '@/utils/useDataFromURL'
import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

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

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  const queryClient = new QueryClient()

  const [currentSeries] = await Promise.all([
    // queries for `useDataFromURL()`
    queryClient.fetchQuery(apiOptions.competition.series.current(seminarId)).catch(() => ({id: -1, semester: -1})),
    queryClient.prefetchQuery(apiOptions.competition.semesterList(seminarId)),
    ...commonQueries(queryClient, resolvedUrl),
  ])

  if (currentSeries.id !== -1) {
    await Promise.all([
      queryClient.prefetchQuery(apiOptions.competition.series.byId(currentSeries.id)),
      queryClient.prefetchQuery(apiOptions.cms.infoBanner.seriesProblems(currentSeries.id)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

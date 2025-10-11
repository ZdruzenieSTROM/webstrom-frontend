import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {createSSRApiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {SemesterAdministration as SemesterAdministrationComponent} from '@/components/SemesterAdministration/SemesterAdministration'
import {getDataFromUrl} from '@/utils/useDataFromURL'
import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

// z nazvu suboru `[[...params]]` - vzdy to musi byt string[]
const PARAM = 'params'

const SemesterAdmnistration: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie semestra">
    <SemesterAdministrationComponent />
  </PageLayout>
)

export default SemesterAdmnistration

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
  const {id} = getDataFromUrl({
    semesterList,
    currentSeriesData: currentSeries,
    params,
  })

  const semesterQuery = ssrApiOptions.competition.semester.byId(id.semesterId)

  if (semesterQuery.enabled) {
    await queryClient.prefetchQuery(semesterQuery)
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

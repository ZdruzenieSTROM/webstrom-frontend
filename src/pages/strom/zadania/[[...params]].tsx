import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions, createSSRApiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'
import {SeriesWithProblems} from '@/types/api/competition'
import {formatDateTime} from '@/utils/formatDate'
import {getSemesterName} from '@/utils/getSemesterName'
import {getSemesterYear} from '@/utils/getSemesterYear'
import {getSeriesName} from '@/utils/getSeriesName'
import {getDataFromUrl, useDataFromURL} from '@/utils/useDataFromURL'
import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

// logika odraza `cms/views.py` na BE - uz si to riesime sami, nevolame BE
const getSeriesState = (series: SeriesWithProblems) => {
  if (series.complete) {
    return 'Séria je uzavretá'
  }
  // zmena oproti BE - termin pridavame vzdy, v kode nizsie
  // if (series.can_submit) {
  //   return `Termín série: ${formatDateTime(series.deadline)}`
  // }
  return 'Prebieha opravovanie'
}

// z nazvu suboru `[[...params]]` - vzdy to musi byt string[]
const PARAM = 'params'

const Zadania: NextPage = () => {
  const {id: currentIds, semesterList} = useDataFromURL()

  const {data: series} = useQuery(apiOptions.competition.series.byId(currentIds.seriesId))

  const semester = semesterList.find(({id}) => id === currentIds.semesterId)

  let title = 'Zadania'
  let subtitle: string | undefined

  if (semester) {
    const semesterTitle = `${getSemesterYear(semester)} - ${getSemesterName(semester)}`

    if (series) {
      title = getSeriesName(series)
      subtitle = semesterTitle
    } else {
      title = semesterTitle
    }
  }

  const seriesName = series && getSeriesName(series)
  const deadline = series && `Termín: ${formatDateTime(series.deadline)}`
  const seriesState = series && getSeriesState(series)

  const messages = [seriesName, deadline, seriesState].filter((message): message is string => !!message)

  return (
    <PageLayout contentWidth={2} title={title} subtitle={subtitle} bannerMessages={messages}>
      <Problems />
    </PageLayout>
  )
}

export default Zadania

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

  const seriesQuery = ssrApiOptions.competition.series.byId(id.seriesId)

  if (seriesQuery.enabled) {
    await queryClient.prefetchQuery(seriesQuery)
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

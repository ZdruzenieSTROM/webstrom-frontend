import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'
import {useRouter} from 'next/router'

import {apiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProblemAdministration as ProblemAdministrationComponent} from '@/components/ProblemAdministration/ProblemAdministration'

const ProblemAdministration: NextPage = () => {
  const router = useRouter()
  const {params} = router.query

  const problemId = params && params[0]

  const {data: problem} = useQuery(apiOptions.competition.problemAdministration.byId(problemId))

  const semesterId = problem?.series?.semester
  const {data: semester} = useQuery(apiOptions.competition.semester.byId(semesterId))
  const semesterName = semester?.season_code === 0 ? 'zima' : 'leto'
  const semesterUrl = `${semester?.year}/${semesterName}`

  let title = 'Opravovanie úlohy'
  let subtitle: string | undefined
  if (problem && semester) {
    subtitle = `${semesterUrl} (${semester.school_year})`
    title = `${problem.order}. úloha - ${problem.series.order}. séria`
  }

  return (
    <PageLayout contentWidth={2} title={title} subtitle={subtitle}>
      <ProblemAdministrationComponent />
    </PageLayout>
  )
}

export default ProblemAdministration

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, req}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl, req))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

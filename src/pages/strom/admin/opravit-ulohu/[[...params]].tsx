import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProblemAdministration as ProblemAdministrationComponent} from '@/components/ProblemAdministration/ProblemAdministration'

const ProblemAdministration: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie úlohy">
    <ProblemAdministrationComponent />
  </PageLayout>
)

export default ProblemAdministration

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

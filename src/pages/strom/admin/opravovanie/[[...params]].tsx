import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {SemesterAdministration as SemesterAdministrationComponent} from '@/components/SemesterAdministration/SemesterAdministration'

const SemesterAdmnistration: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie semestra">
    <SemesterAdministrationComponent />
  </PageLayout>
)

export default SemesterAdmnistration

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all([...commonQueries(queryClient, resolvedUrl)])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

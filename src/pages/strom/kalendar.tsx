import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {Calendar} from '@/components/Calendar/Calendar'
import {PageLayout} from '@/components/PageLayout/PageLayout'

const KalendarPage: NextPage = () => (
  <PageLayout title="Kalendár">
    <Calendar />
  </PageLayout>
)

export default KalendarPage

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, req}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl, req))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

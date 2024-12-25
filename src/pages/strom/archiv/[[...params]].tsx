import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'

import {Archive} from '../../../components/Archive/Archive'

const Archiv: NextPage = () => {
  return (
    <PageLayout title="Archív" contentWidth={2}>
      <Archive />
    </PageLayout>
  )
}

export default Archiv

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all([...commonQueries(queryClient, resolvedUrl)])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

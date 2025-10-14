import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {VerifyEmail} from '@/components/VerifyEmail/VerifyEmail'

const Verify: NextPage = () => (
  <PageLayout title="Verifikácia">
    <VerifyEmail />
  </PageLayout>
)

export default Verify

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, req}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl, req))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {apiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'
import {getSeminarInfoFromPathname} from '@/utils/useSeminarInfo'

const Strom: NextPage = () => (
  <PageLayout title="Príspevky" contentWidth={1}>
    <Posts />
  </PageLayout>
)

export default Strom

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const {seminarId} = getSeminarInfoFromPathname(resolvedUrl)

  const queryClient = new QueryClient()

  await Promise.all([
    ...commonQueries(queryClient, resolvedUrl),
    queryClient.prefetchQuery(apiOptions.cms.post.visible(seminarId)),
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

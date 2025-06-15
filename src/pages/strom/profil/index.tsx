import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProfileDetail} from '@/components/Profile/ProfileDetail'

const Profile: NextPage = () => (
  <PageLayout contentWidth={2} title="Profil">
    <ProfileDetail />
  </PageLayout>
)

export default Profile

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

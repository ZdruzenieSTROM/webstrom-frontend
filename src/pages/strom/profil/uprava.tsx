import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProfileForm} from '@/components/Profile/ProfileForm'

const Profil: NextPage = () => (
  <PageLayout contentWidth={1} title="Profil">
    <ProfileForm />
  </PageLayout>
)

export default Profil

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all([...commonQueries(queryClient, resolvedUrl)])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

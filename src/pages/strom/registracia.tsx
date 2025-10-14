import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {RegisterForm} from '@/components/RegisterForm/RegisterForm'

const Register: NextPage = () => (
  <PageLayout contentWidth={1} title="Registrácia">
    <RegisterForm />
  </PageLayout>
)

export default Register

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl, req}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl, req))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

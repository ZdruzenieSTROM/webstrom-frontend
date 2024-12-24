import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Results} from '@/components/Results/Results'

const Vysledky: NextPage = () => {
  return (
    <PageLayout contentWidth={2} title="Výsledky" sx={{px: 0}}>
      <Results />
    </PageLayout>
  )
}

export default Vysledky

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all([...commonQueries(queryClient, resolvedUrl)])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

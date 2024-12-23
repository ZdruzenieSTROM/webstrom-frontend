import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'
import {useRouter} from 'next/router'
import {ParsedUrlQuery} from 'querystring'

import {apiOptions} from '@/api/api'
import {CompetitionPage} from '@/components/CompetitionPage/CompetitionPage'
import {RulesPage} from '@/components/CompetitionPage/RulesPage'
import {PageLayout} from '@/components/PageLayout/PageLayout'

// z nazvu suboru `[[...params]]` - vzdy to musi byt string[]
const PARAM = 'params'
const getParams = (query: ParsedUrlQuery) => {
  const params = query[PARAM] as string[]
  const requestedUrl = params[0]
  const isRules = params.length === 2 && params[1] === 'pravidla'

  return {requestedUrl, isRules}
}

const StaticPage: NextPage = () => {
  const {query} = useRouter()
  const {requestedUrl, isRules} = getParams(query)

  const {data, isPending, isError} = useQuery(apiOptions.competition.competition.slug(requestedUrl))

  // TODO: handle
  if (isPending) return null
  if (isError) return null

  return (
    <PageLayout title={data.name}>
      {isRules ? (
        <RulesPage name={data.name} rules={data.rules} upcoming_or_current_event={data.upcoming_or_current_event} />
      ) : (
        <CompetitionPage competition={data} />
      )}
    </PageLayout>
  )
}

export default StaticPage

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const {requestedUrl} = getParams(query)

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(apiOptions.competition.competition.slug(requestedUrl))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

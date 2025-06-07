import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'
import {useRouter} from 'next/router'
import {ParsedUrlQuery} from 'querystring'

import {apiOptions} from '@/api/api'
import {commonQueries} from '@/api/commonQueries'
import {CompetitionPage} from '@/components/CompetitionPage/CompetitionPage'
import {Loading} from '@/components/Loading/Loading'
import {Markdown} from '@/components/Markdown/Markdown'
import {PageLayout} from '@/components/PageLayout/PageLayout'

const SUBSITES = new Set(['podrobnosti', 'pravidla'])

// z nazvu suboru `[[...params]]` - vzdy to musi byt string[]
const PARAM = 'params'

const getParams = (query: ParsedUrlQuery) => {
  const params = query[PARAM] as string[]
  const requestedUrl = params[0]
  const subsite = params.length >= 2 ? params[1] : undefined

  return {requestedUrl, subsite}
}

const StaticPage: NextPage = () => {
  const {query} = useRouter()
  const {requestedUrl, subsite} = getParams(query)

  const {data, isPending, isError} = useQuery(apiOptions.competition.competition.slug(requestedUrl))

  if (isPending) return <Loading />
  // TODO: show error? redirect on server?
  if (isError) return null

  // invalid (unknown) subsite
  if (subsite && !SUBSITES.has(subsite)) {
    // TODO: show error? redirect on server?
    return null
  }

  return (
    <PageLayout title={data.name}>
      {subsite === 'podrobnosti' && <Markdown content={data.long_description ?? ''} />}
      {subsite === 'pravidla' && <Markdown content={data.rules ?? ''} />}
      {!subsite && <CompetitionPage competition={data} />}
    </PageLayout>
  )
}

export default StaticPage

export const getServerSideProps: GetServerSideProps = async ({query, resolvedUrl}) => {
  const {requestedUrl} = getParams(query)

  const queryClient = new QueryClient()

  await Promise.all([
    ...commonQueries(queryClient, resolvedUrl),
    queryClient.prefetchQuery(apiOptions.competition.competition.slug(requestedUrl)),
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

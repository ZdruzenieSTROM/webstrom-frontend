import {dehydrate, QueryClient, useQuery} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'
import {useRouter} from 'next/router'
import {ParsedUrlQuery} from 'querystring'

import {apiOptions} from '@/api/api'
import {Markdown} from '@/components/Markdown/Markdown'
import {PageLayout} from '@/components/PageLayout/PageLayout'

// z nazvu suboru `[page]` - vzdy to musi byt string
const PARAM = 'page'
const getParam = (query: ParsedUrlQuery) => query[PARAM] as string

const StaticPage: NextPage = () => {
  const {query} = useRouter()
  const requestedUrl = getParam(query)

  const {data} = useQuery(apiOptions.cms.flatPage.byUrl(requestedUrl))

  const content = data?.content ?? ''
  const title = data?.title

  return (
    <PageLayout title={title}>
      <Markdown content={content} />
    </PageLayout>
  )
}
export default StaticPage

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const requestedUrl = getParam(query)

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(apiOptions.cms.flatPage.byUrl(requestedUrl))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

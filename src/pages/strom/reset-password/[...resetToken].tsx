import {Typography} from '@mui/material'
import {dehydrate, QueryClient} from '@tanstack/react-query'
import {GetServerSideProps, NextPage} from 'next'
import {useRouter} from 'next/router'
import {ParsedUrlQuery} from 'querystring'

import {commonQueries} from '@/api/commonQueries'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PasswordResetForm} from '@/components/PasswordReset/PasswordReset'

// z nazvu suboru `[...resetToken]` - vzdy to musi byt pole stringov, ale nevieme garantovat viac ako jeden segment
const PARAM = 'resetToken'
type Params = [string, ...(string | undefined)[]]
const getParams = (query: ParsedUrlQuery) => {
  const params = query[PARAM] as Params

  const [token, uid] = params

  return {token, uid}
}

const PasswordReset: NextPage = () => {
  const {query} = useRouter()
  const {uid, token} = getParams(query)

  return (
    <PageLayout title="Zabudnuté heslo" contentWidth={1}>
      {uid ? (
        <PasswordResetForm uid={uid} token={token} />
      ) : (
        <Typography variant="body1">Neplatný odkaz, chýbajúci parameter uid.</Typography>
      )}
    </PageLayout>
  )
}

export default PasswordReset

export const getServerSideProps: GetServerSideProps = async ({resolvedUrl}) => {
  const queryClient = new QueryClient()

  await Promise.all(commonQueries(queryClient, resolvedUrl))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

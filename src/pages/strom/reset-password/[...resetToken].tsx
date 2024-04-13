import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PasswordResetForm, PasswordResetFormProps} from '@/components/PasswordReset/PasswordReset'

type QueryType = {
  query?: {
    resetToken: string | string[]
  }
}

const PasswordReset: NextPage<PasswordResetFormProps> = ({uid, token}) => (
  <PageLayout title="Zabudnuté heslo" contentWidth={1}>
    <PasswordResetForm uid={uid} token={token} />
  </PageLayout>
)

export default PasswordReset

export const getServerSideProps = async ({query}: QueryType) => {
  const errorRedirect = {redirect: {destination: '/', permanent: false}}

  if (query?.resetToken && Array.isArray(query.resetToken) && query.resetToken.length === 2) {
    const token = query.resetToken[0]
    const uid = query.resetToken[1]

    if (typeof token === 'string' && typeof uid === 'string') return {props: {uid: uid, token: token}}
  }

  return errorRedirect
}

import {NextPage} from 'next'

import {Verification} from '@/components/Verification/Verification'

import {PageLayout} from '../../../components/PageLayout/PageLayout'

const PasswordResetRequest: NextPage = () => {
  return (
    <PageLayout title="Reset hesla" contentWidth={2}>
      <Verification />
    </PageLayout>
  )
}

export default PasswordResetRequest

import {NextPage} from 'next'

import {PasswordResetSent} from '@/components/PasswordResetSent/PasswordResetSent'

import {PageLayout} from '../../../components/PageLayout/PageLayout'

const Verifikacia: NextPage = () => {
  return (
    <PageLayout title="Zabudnuté heslo" contentWidth={2}>
      <PasswordResetSent />
    </PageLayout>
  )
}

export default Verifikacia

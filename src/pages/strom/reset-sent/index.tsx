import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PasswordResetSent} from '@/components/PasswordResetSent/PasswordResetSent'

const Verifikacia: NextPage = () => {
  return (
    <PageLayout title="Zabudnuté heslo" contentWidth={2}>
      <PasswordResetSent />
    </PageLayout>
  )
}

export default Verifikacia

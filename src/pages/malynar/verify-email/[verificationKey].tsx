import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {VerifyEmail} from '@/components/VerifyEmail/VerifyEmail'

const Verify: NextPage = () => (
  <PageLayout>
    <VerifyEmail />
  </PageLayout>
)

export default Verify

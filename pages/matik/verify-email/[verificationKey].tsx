import {NextPage} from 'next'

import {PageLayout} from '../../../src/components/PageLayout/PageLayout'
import {VerifyEmail} from '../../../src/components/VerifyEmail/VerifyEmail'

const Verify: NextPage = () => (
  <PageLayout seminarId={2}>
    <VerifyEmail />
  </PageLayout>
)

export default Verify

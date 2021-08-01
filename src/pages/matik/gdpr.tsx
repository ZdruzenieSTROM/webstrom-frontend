import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Gdpr: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Ochrana osobných údajov" />
  </PageLayout>
)

export default Gdpr

import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Gdpr: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Ochrana osobných údajov" />
  </PageLayout>
)

export default Gdpr

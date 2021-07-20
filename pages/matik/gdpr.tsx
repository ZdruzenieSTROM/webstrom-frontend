import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/pages/PagePlaceholder'

const Gdpr: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Ochrana osobných údajov" />
  </PageLayout>
)

export default Gdpr

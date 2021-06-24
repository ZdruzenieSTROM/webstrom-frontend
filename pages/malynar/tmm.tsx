import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/pages/PagePlaceholder'

const Tmm: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="TMM" />
  </PageLayout>
)

export default Tmm

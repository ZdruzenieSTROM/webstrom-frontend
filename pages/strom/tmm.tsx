import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Tmm: NextPage = () => (
  <PageLayout seminarId={1}>
    <PagePlaceholder title="TMM" />
  </PageLayout>
)

export default Tmm

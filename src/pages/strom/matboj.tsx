import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Matboj: NextPage = () => (
  <PageLayout seminarId={1}>
    <PagePlaceholder title="Matboj" />
  </PageLayout>
)

export default Matboj
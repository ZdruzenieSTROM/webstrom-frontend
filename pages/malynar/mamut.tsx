import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Mamut: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Mamut" />
  </PageLayout>
)

export default Mamut

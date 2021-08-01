import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Test: NextPage = () => (
  <PageLayout seminarId={0}>
    <PagePlaceholder title="Examples" />
  </PageLayout>
)

export default Test
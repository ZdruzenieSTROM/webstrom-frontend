import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Test: NextPage = () => (
  <PageLayout seminarId={0}>
    <PagePlaceholder title="Examples" />
  </PageLayout>
)

export default Test

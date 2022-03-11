import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Test: NextPage = () => (
  <PageLayout>
    <PagePlaceholder title="Examples" />
  </PageLayout>
)

export default Test

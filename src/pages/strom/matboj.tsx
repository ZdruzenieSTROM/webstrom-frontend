import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Matboj: NextPage = () => (
  <PageLayout seminarId={1}>
    <PagePlaceholder title="Matboj" />
  </PageLayout>
)

export default Matboj

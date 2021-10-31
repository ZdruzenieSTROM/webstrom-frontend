import {NextPage} from 'next'

import {Matboj as MatbojComponent} from '@/components/Matboj/Matboj'
import {PageLayout} from '@/components/PageLayout/PageLayout'

const Matboj: NextPage = () => (
  <PageLayout contentWidth={2} title={'Košický Matboj'}>
    <MatbojComponent />
  </PageLayout>
)

export default Matboj

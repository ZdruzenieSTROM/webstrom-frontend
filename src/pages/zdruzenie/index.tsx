import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Zdruzenie: NextPage = () => (
  <PageLayout seminarId={4}>
    <PagePlaceholder title="Združenie Strom" />
  </PageLayout>
)

export default Zdruzenie

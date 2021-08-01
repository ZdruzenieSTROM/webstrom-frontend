import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Minisustredenia: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Minisústredenia" />
  </PageLayout>
)

export default Minisustredenia

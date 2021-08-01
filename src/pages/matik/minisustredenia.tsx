import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Minisustredenia: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Minisústredenia" />
  </PageLayout>
)

export default Minisustredenia

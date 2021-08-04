import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder'

const Lomihlav: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Lomihlav" />
  </PageLayout>
)

export default Lomihlav

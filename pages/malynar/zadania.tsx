import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/pages/PagePlaceholder'

const Zadania: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Zadania" />
  </PageLayout>
)

export default Zadania

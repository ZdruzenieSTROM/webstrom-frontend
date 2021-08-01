import {NextPage} from 'next'

import {PageLayout} from '../../components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../components/PagePlaceholder'

const Mamut: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Mamut" />
  </PageLayout>
)

export default Mamut

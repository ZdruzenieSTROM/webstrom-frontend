import {NextPage} from 'next'

import {PageLayout} from '../../components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../components/PagePlaceholder'

const Tmm: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="TMM" />
  </PageLayout>
)

export default Tmm

import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {Posts} from '../../src/pages/Post/Post'

const Malynar: NextPage = () => (
  <PageLayout seminarId={3}>
    <Posts seminarId={3} />
  </PageLayout>
)

export default Malynar

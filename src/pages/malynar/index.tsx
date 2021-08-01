import {NextPage} from 'next'

import {PageLayout} from '../../components/PageLayout/PageLayout'
import {Posts} from '../../components/Post/Post'

const Malynar: NextPage = () => (
  <PageLayout seminarId={3}>
    <Posts seminarId={3} />
  </PageLayout>
)

export default Malynar

import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {Posts} from '../../src/components/Post/Post'

const Strom: NextPage = () => (
  <PageLayout seminarId={1}>
    <Posts seminarId={1} />
  </PageLayout>
)

export default Strom

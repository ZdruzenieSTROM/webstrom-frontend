import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Malynar: NextPage = () => (
  <PageLayout title="Seminár Malynár">
    <Posts seminarId={3} />
  </PageLayout>
)

export default Malynar

import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Strom: NextPage = () => (
  <PageLayout title="Seminár Strom">
    <Posts seminarId={1} />
  </PageLayout>
)

export default Strom

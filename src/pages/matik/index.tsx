import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Matik: NextPage = () => (
  <PageLayout title="Seminár Matik">
    <Posts seminarId={2} />
  </PageLayout>
)

export default Matik

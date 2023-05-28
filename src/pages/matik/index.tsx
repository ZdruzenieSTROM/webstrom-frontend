import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Matik: NextPage = () => (
  <PageLayout title="Seminár Matik">
    <Posts />
  </PageLayout>
)

export default Matik

import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Matik: NextPage = () => (
  <PageLayout title="Seminár Matik" contentWidth={1}>
    <Posts />
  </PageLayout>
)

export default Matik

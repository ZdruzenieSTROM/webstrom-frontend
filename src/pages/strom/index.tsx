import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Strom: NextPage = () => (
  <PageLayout title="Príspevky" contentWidth={3}>
    <Posts />
  </PageLayout>
)

export default Strom

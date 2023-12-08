import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Strom: NextPage = () => (
  <PageLayout title="Novinky" contentWidth={1}>
    <Posts />
  </PageLayout>
)

export default Strom

import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Posts/Posts'

const Malynar: NextPage = () => (
  <PageLayout title="Novinky" contentWidth={1}>
    <Posts />
  </PageLayout>
)

export default Malynar

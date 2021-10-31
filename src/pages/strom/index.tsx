import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Post/Post'

const Strom: NextPage = () => (
  <PageLayout contentWidth={1} title={'Seminár Strom'}>
    <Posts seminarId={1} />
  </PageLayout>
)

export default Strom

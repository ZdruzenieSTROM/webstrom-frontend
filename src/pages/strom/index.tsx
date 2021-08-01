import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Post/Post'

const Strom: NextPage = () => (
  <PageLayout seminarId={1}>
    <Posts seminarId={1} />
  </PageLayout>
)

export default Strom

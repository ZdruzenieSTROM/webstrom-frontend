import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Posts} from '@/components/Post/Post'

const Matik: NextPage = () => (
  <PageLayout seminarId={2}>
    <Posts seminarId={2} />
  </PageLayout>
)

export default Matik

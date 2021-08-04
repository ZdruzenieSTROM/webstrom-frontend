import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'

const ProblemsPage: NextPage = () => (
  <PageLayout seminarId={1}>
    <Problems seminarId={1} />
  </PageLayout>
)

export default ProblemsPage

import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'

const ProblemsPage: NextPage = () => (
  <PageLayout seminarId={2}>
    <Problems seminarId={2} />
  </PageLayout>
)

export default ProblemsPage

import {NextPage} from 'next'

import {PageLayout} from '../../../components/PageLayout/PageLayout'
import {Problems} from '../../../components/Problems/Problems'

const ProblemsPage: NextPage = () => (
  <PageLayout seminarId={3}>
    <Problems seminarId={3} />
  </PageLayout>
)

export default ProblemsPage

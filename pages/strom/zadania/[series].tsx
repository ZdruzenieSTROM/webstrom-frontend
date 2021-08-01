import {NextPage} from 'next'

import {PageLayout} from '../../../src/components/PageLayout/PageLayout'
import {Problems} from '../../../src/components/Problems/Problems'

const ProblemsPage: NextPage = () => (
  <PageLayout seminarId={1}>
    <Problems seminarId={1} />
  </PageLayout>
)

export default ProblemsPage

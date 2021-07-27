import {NextPage} from 'next'

import {PageLayout} from '../../../src/components/PageLayout/PageLayout'
import {Problems} from '../../../src/pages/Competition/Problems'

const ProblemsPage: NextPage = () => (
  <PageLayout seminarId={1}>
    <Problems seminarId={1} />
  </PageLayout>
)

export default ProblemsPage

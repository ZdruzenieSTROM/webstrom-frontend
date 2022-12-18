import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProblemAdministration as ProblemAdministrationComponent} from '@/components/ProblemAdministration/ProblemAdministration'

const Matboj: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie série">
    <ProblemAdministrationComponent problemId={1} />
  </PageLayout>
)

export default Matboj

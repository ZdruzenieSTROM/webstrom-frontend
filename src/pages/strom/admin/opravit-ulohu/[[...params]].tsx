import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {ProblemAdministration as ProblemAdministrationComponent} from '@/components/ProblemAdministration/ProblemAdministration'

const ProblemAdministration: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie úlohy">
    <ProblemAdministrationComponent />
  </PageLayout>
)

export default ProblemAdministration

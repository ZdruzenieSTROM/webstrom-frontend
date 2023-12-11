import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {SemesterAdministration as SemesterAdministrationComponent} from '@/components/SemesterAdministration/SemesterAdministration'

const SemesterAdmnistration: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie semestra">
    <SemesterAdministrationComponent />
  </PageLayout>
)

export default SemesterAdmnistration

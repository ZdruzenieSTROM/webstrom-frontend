import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {SemesterAdministration as SemesterAdministrationComponent} from '@/components/SemesterAdministration/SemesterAdministration'

const Matboj: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie série">
    <SemesterAdministrationComponent semesterIdInitial={1} />
  </PageLayout>
)

export default Matboj

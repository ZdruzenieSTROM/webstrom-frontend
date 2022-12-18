import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {SeriesAdministration as SeriesAdministrationComponent} from '@/components/SeriesAdministration/SeriesAdministration'

const Matboj: NextPage = () => (
  <PageLayout contentWidth={2} title="Opravovanie série">
    <SeriesAdministrationComponent seriesIdInitial={1} />
  </PageLayout>
)

export default Matboj

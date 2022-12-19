import {NextPage} from 'next'

import {Archive} from '../../../components/Archive/Archive'
import {PageLayout} from '../../../components/PageLayout/PageLayout'

const Archiv: NextPage = () => {
  return (
    <PageLayout title="Archív" contentWidth={2}>
      <Archive />
    </PageLayout>
  )
}

export default Archiv

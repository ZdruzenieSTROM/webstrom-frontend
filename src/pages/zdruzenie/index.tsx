import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Zdruzenie: NextPage = () => (
  <PageLayout seminarId={4}>
    <PagePlaceholder title="Združenie Strom" />
  </PageLayout>
)

export default Zdruzenie

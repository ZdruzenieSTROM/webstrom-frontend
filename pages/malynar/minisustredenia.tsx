import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Minisustredenia: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Minisústredenia" />
  </PageLayout>
)

export default Minisustredenia

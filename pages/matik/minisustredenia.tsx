import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/pages/PagePlaceholder'

const Minisustredenia: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Minisústredenia" />
  </PageLayout>
)

export default Minisustredenia

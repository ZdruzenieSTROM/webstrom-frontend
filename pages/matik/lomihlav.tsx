import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Lomihlav: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Lomihlav" />
  </PageLayout>
)

export default Lomihlav

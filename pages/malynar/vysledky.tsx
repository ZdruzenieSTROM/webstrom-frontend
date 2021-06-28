import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/pages/PagePlaceholder'

const Vysledky: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Výsledky" />
  </PageLayout>
)

export default Vysledky

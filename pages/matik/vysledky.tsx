import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Vysledky: NextPage = () => (
  <PageLayout seminarId={2}>
    <PagePlaceholder title="Výsledky" />
  </PageLayout>
)

export default Vysledky

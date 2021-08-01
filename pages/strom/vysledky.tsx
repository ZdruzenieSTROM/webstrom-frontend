import {NextPage} from 'next'

import {PageLayout} from '../../src/components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../src/components/PagePlaceholder'

const Vysledky: NextPage = () => (
  <PageLayout seminarId={1}>
    <PagePlaceholder title="Výsledky" />
  </PageLayout>
)

export default Vysledky

import {NextPage} from 'next'

import {PageLayout} from '../../components/PageLayout/PageLayout'
import {PagePlaceholder} from '../../components/PagePlaceholder'

const Vysledky: NextPage = () => (
  <PageLayout seminarId={3}>
    <PagePlaceholder title="Výsledky" />
  </PageLayout>
)

export default Vysledky

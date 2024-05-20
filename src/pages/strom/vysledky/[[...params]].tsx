import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Results} from '@/components/Results/Results'

const Vysledky: NextPage = () => {
  return (
    <PageLayout contentWidth={2} title="Výsledky" sx={{px: 0}}>
      <Results />
    </PageLayout>
  )
}

export default Vysledky

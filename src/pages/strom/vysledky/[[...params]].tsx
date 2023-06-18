import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Results} from '@/components/Results/Results'

const Vysledky: NextPage = () => {
  return (
    <PageLayout contentWidth={2}>
      <Results />
    </PageLayout>
  )
}

export default Vysledky

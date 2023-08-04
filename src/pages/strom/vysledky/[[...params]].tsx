import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Results} from '@/components/Results/Results'
import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'

const Vysledky: NextPage = () => {
  return (
    <PageLayout contentWidth={2}>
      <SemesterPicker />
      <Results />
    </PageLayout>
  )
}

export default Vysledky

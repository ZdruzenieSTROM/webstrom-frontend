import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'
import {SemesterPicker} from '@/components/SemesterPicker/SemesterPicker'

const Zadania: NextPage = () => {
  return (
    <PageLayout contentWidth={2}>
      <SemesterPicker />
      <Problems />
    </PageLayout>
  )
}

export default Zadania

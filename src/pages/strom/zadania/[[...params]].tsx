import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'

const Zadania: NextPage = () => {
  return (
    <PageLayout contentWidth={3} title={'Zadania'}>
      <Problems />
    </PageLayout>
  )
}

export default Zadania

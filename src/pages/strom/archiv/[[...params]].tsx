import {NextPage} from 'next'

import {PageLayout} from '@/components/PageLayout/PageLayout'

import {Archive} from '../../../components/Archive/Archive'

const Archiv: NextPage = () => {
  return (
    <PageLayout title="Archív" contentWidth={2}>
      <Archive />
    </PageLayout>
  )
}

export default Archiv

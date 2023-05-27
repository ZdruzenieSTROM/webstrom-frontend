import {NextPage} from 'next'

import {PageLayout} from '../../../components/PageLayout/PageLayout'
import {Verification} from '../../../components/Verification/Verification'

const Verifikacia: NextPage = () => {
  return (
    <PageLayout title="Verifikácia" contentWidth={2}>
      <Verification />
    </PageLayout>
  )
}

export default Verifikacia

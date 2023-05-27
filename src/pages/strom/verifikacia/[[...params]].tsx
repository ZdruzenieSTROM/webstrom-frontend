import {NextPage} from 'next'

import {PageLayout} from '../../../components/PageLayout/PageLayout'

const Verifikacia: NextPage = () => {
  return (
    <PageLayout title="Verifikácia" contentWidth={2}>
      Verifikačný e-mail bol odoslaný na zadanú e-mailovú adresu.
    </PageLayout>
  )
}

export default Verifikacia

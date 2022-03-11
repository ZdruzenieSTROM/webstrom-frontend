import {NextPage} from 'next'
import {useState} from 'react'

import {PageLayout} from '../../../components/PageLayout/PageLayout'
import {Results} from '../../../components/Results/Results'

const Vysledky: NextPage = () => {
  const [pageTitle, setPageTitle] = useState('')

  return (
    <PageLayout title={pageTitle} contentWidth={2}>
      <Results setPageTitle={setPageTitle} />
    </PageLayout>
  )
}

export default Vysledky

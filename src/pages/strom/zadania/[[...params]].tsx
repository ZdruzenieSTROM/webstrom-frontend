import {NextPage} from 'next'
import {useState} from 'react'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'

const Zadania: NextPage = () => {
  const [pageTitle, setPageTitle] = useState('')

  return (
    <PageLayout contentWidth={2} title={pageTitle}>
      <Problems setPageTitle={setPageTitle} />
    </PageLayout>
  )
}

export default Zadania

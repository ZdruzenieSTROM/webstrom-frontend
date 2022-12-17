import {NextPage} from 'next'
import {useState} from 'react'

import {Archive} from '../../../components/Archive/Archive'
import {PageLayout} from '../../../components/PageLayout/PageLayout'

const Archiv: NextPage = () => {
  const [pageTitle, setPageTitle] = useState('')

  return (
    <PageLayout title={pageTitle} contentWidth={2}>
      <Archive setPageTitle={setPageTitle} />
    </PageLayout>
  )
}

export default Archiv

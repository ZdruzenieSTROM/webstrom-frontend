import {NextPage} from 'next'
import {NextRouter, useRouter} from 'next/router'
import {useState} from 'react'

import {PageLayout} from '@/components/PageLayout/PageLayout'
import {Problems} from '@/components/Problems/Problems'

const Zadania: NextPage = () => {
  const [pageTitle, setPageTitle] = useState('')
  const router: NextRouter = useRouter()

  return (
    <PageLayout contentWidth={2} title={pageTitle}>
      <Problems seminarId={getSeminarId(router.pathname)} setPageTitle={setPageTitle} />
    </PageLayout>
  )
}

export default Zadania

const getSeminarId = (pathname: string) => {
  switch (pathname.slice(1).split('/', 1)[0]) {
    case 'strom':
      return 0
    case 'matik':
      return 1
    case 'malynar':
      return 2
    default:
      return -1
  }
}

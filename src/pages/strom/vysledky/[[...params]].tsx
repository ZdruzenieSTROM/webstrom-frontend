import {NextPage} from 'next'
import {NextRouter, useRouter} from 'next/router'
import {useState} from 'react'

import {PageLayout} from '../../../components/PageLayout/PageLayout'
import {Results} from '../../../components/Results/Results'

interface ResultsRoute {
  [0]: number | undefined
  [1]: string | undefined
  [2]: number | undefined
}

const Vysledky: NextPage = () => {
  const [pageTitle, setPageTitle] = useState('')
  const router: NextRouter = useRouter()

  return (
    <PageLayout title={pageTitle} contentWidth={2}>
      <Results seminarId={getSeminarId(router.pathname)} setPageTitle={setPageTitle} />
    </PageLayout>
  )
}

export default Vysledky

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

const num = (n: any) => {
  if (Number.isNaN(Number(n))) {
    return -1
  } else {
    return Number(n) ?? -1
  }
}
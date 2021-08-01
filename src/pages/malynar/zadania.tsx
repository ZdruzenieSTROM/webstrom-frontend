import {NextPage} from 'next'
import Link from 'next/link'

import {getSeminarName} from '@/components/PageLayout/components/MenuMain'
import {PageLayout} from '@/components/PageLayout/PageLayout'

const Zadania: NextPage = () => {
  const seminarName = getSeminarName(3)

  return (
    <PageLayout seminarId={3}>
      <div>
        <h1>Zadania</h1>
        <Link href={`/${seminarName}/zadania/0`}>
          <a>
            <h2>1. SÉRIA ZIMNÉHO SEMESTRA</h2>
          </a>
        </Link>
        <Link href={`/${seminarName}/zadania/1`}>
          <a>
            <h2>2. SÉRIA ZIMNÉHO SEMESTRA</h2>
          </a>
        </Link>
      </div>
    </PageLayout>
  )
}

export default Zadania

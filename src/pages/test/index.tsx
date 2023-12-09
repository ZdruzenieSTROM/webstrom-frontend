import {NextPage} from 'next'

import {Link} from '@/components/Clickable/Link'
import {PageLayout} from '@/components/PageLayout/PageLayout'
import {PagePlaceholder} from '@/components/PagePlaceholder/PagePlaceholder'

const Test: NextPage = () => (
  <PageLayout>
    <PagePlaceholder title="Examples" />
    <Link href="/test/latex">Latex example</Link>
  </PageLayout>
)

export default Test

import {NextPage} from 'next'

import {LatexExample} from '@/components/Latex/LatexExample'
import {PageLayout} from '@/components/PageLayout/PageLayout'

const Latex: NextPage = () => (
  <PageLayout>
    <LatexExample />
  </PageLayout>
)

export default Latex

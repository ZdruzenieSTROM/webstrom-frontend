import {NextPage} from 'next'

import {LatexExample} from '../../src/components/Latex/LatexExample'
import {PageLayout} from '../../src/components/PageLayout/PageLayout'

const Latex: NextPage = () => (
  <PageLayout seminarId={0}>
    <LatexExample />
  </PageLayout>
)

export default Latex

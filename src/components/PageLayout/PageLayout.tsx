import {FC} from 'react'

import {ScrollingText} from '../ScrollingText/ScrollingText'
import {Footer} from './Footer/Footer'
import {MenuMain} from './MenuMain/MenuMain'
import {MenuSeminars} from './MenuSeminars/MenuSeminars'

export const PageLayout: FC<{seminarId: number}> = ({seminarId, children}) => (
  <div id="main-content">
    <div id="page-container">
      <MenuSeminars seminarId={seminarId} />
      <MenuMain seminarId={seminarId} />
      {/* ScrollingText sa mozno este niekam presumie podla toho kde vsade sa bude pouzivat */}
      <ScrollingText />
      {children}
      <Footer />
    </div>
  </div>
)

import React, {FC} from 'react'

import {Footer} from './components/Footer'
import {MenuMain} from './components/MenuMain'
import {MenuSeminars} from './components/MenuSeminars'

export const PageLayout: FC<{seminarId: number}> = ({seminarId, children}) => (
  <div id="page-container">
    <MenuSeminars seminarId={seminarId} />
    <MenuMain seminarId={seminarId} />
    {children}
    <Footer />
  </div>
)

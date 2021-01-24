import React, {FC} from 'react'

import {Footer} from '../Footer'
import {MenuMain} from '../MenuMain'
import {MenuSeminars} from '../MenuSeminars'

export const PageLayout: FC<{seminarId: number}> = ({seminarId, children}) => (
  <div id="page-container">
    <MenuSeminars seminarId={seminarId} />
    <MenuMain seminarId={seminarId} />
    {children}
    <Footer />
  </div>
)

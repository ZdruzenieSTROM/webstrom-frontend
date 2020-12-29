import './MenuSeminars.css'

import React from 'react'
import {Link} from 'react-router-dom'

export const MenuSeminars: React.FC<{seminarId: number}> = ({seminarId}) => {
  return (
    <div id="menu-seminars">
      <div className={seminarId === 3 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link to="/malynar/">Malynár</Link>
      </div>
      <div className={seminarId === 2 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link to="/matik/">Matik</Link>
      </div>
      <div className={seminarId === 1 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link to="/strom/">Strom</Link>
      </div>
      <div className={seminarId === 4 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
        <Link to="/zdruzenie/">Združenie</Link>
      </div>
    </div>
  )
}

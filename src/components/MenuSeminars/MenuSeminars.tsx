import React from 'react'
import './MenuSeminars.css'

// Nie som si istý, či sa dá zmeniť subdoména bez toho, aby sa prehliadač musel reloadnuť.
// Ak je to možné, pridal by som updateSeminarId handler na zmenu statu seminarId o component vyššie.
//
// export const MenuSeminars: React.FC<{ updateSeminarId: () => void }> = ({ updateSeminarId }) => (
export const MenuSeminars: React.FC<{ seminarId: number }> = ({ seminarId }) => (
  <div id="menu-seminars">
    <div className={seminarId === 3 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
      <a href="http://malynar.localhost:3000/">Malynár</a>
    </div>
    <div className={seminarId === 2 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
      <a href="http://matik.localhost:3000/">Matik</a>
    </div>
    <div className={seminarId === 1 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
      <a href="http://strom.localhost:3000/">Strom</a>
    </div>
    <div className={seminarId === 4 ? 'menu-seminars-item active' : 'menu-seminars-item'}>
      <a href="http://zdruzenie.localhost:3000/">Združenie</a>
    </div>
  </div>
)

// import './ScrollingText.scss'
import React from 'react'

import {Marquee} from '../Marquee/Marquee'

export const ScrollingText: React.FC = () => {
  // text sa bude nacitavat z API ked bude vytvoreny endpoint na to
  const text =
    'Matboj sa uskutoční 15. októbra 2021 - Matboj sa uskutoční 15. októbra 2021 - Matboj sa uskutoční 15. októbra 2021'
  return (
    <div className="scrolling-text">
      <Marquee gradient={false} speed={50}>
        <div className="marquee-text-container">{text}</div>
      </Marquee>
    </div>
  )
}

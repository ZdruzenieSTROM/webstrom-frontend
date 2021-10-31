// import './ScrollingText.scss'
import {FC} from 'react'

import {Marquee} from '../Marquee/Marquee'
import styles from './ScrollingText.module.scss'

export const ScrollingText: FC = () => {
  // text sa bude nacitavat z API ked bude vytvoreny endpoint na to
  const text =
    'Matboj sa uskutoční 15. októbra 2021 - Matboj sa uskutoční 15. októbra 2021 - Matboj sa uskutoční 15. októbra 2021'
  return (
    <div className={styles.scrollingText}>
      <Marquee gradient={false} speed={50}>
        <div className={styles.marqueeTextContainer}>{text}</div>
      </Marquee>
    </div>
  )
}

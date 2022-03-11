import {FC} from 'react'

import {Marquee} from '@/components/Marquee/Marquee'

import styles from './Banner.module.scss'

export const Banner: FC = () => {
  const text =
    'Matboj sa uskutoční 15. októbra 2021 - Matboj sa uskutoční 15. októbra 2021 - Matboj sa uskutoční 15. októbra 2021'
  return (
    <div className={styles.banner}>
      <Marquee gradient={false} speed={50}>
        <div className={styles.marqueeTextContainer}>{text}</div>
      </Marquee>
    </div>
  )
}

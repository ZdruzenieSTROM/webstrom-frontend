import {FC} from 'react'

import {Marquee} from '@/components/Marquee/Marquee'
import {BannerContainer} from '@/utils/BannerContainer'

import styles from './Banner.module.scss'

export const Banner: FC = () => {
  const {bannerText} = BannerContainer.useContainer()
  return (
    <div className={styles.banner}>
      <Marquee gradient={false} speed={100}>
        <div className={styles.marqueeTextContainer}>{bannerText}</div>
      </Marquee>
    </div>
  )
}

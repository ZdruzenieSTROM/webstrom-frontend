import {Typography} from '@mui/material'
import {FC} from 'react'

import {Marquee} from '@/components/Marquee/Marquee'
import {BannerContainer} from '@/utils/BannerContainer'

import styles from './Banner.module.scss'

export const Banner: FC = () => {
  const {bannerText} = BannerContainer.useContainer()
  return (
    <div className={styles.banner}>
      <Marquee gradient={false} speed={100}>
        <Typography variant="h2" component="span" className={styles.marqueeTextContainer}>
          {bannerText || '\u00A0'}
        </Typography>
      </Marquee>
    </div>
  )
}

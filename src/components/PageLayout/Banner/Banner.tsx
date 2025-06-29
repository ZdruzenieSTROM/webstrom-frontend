import {Typography} from '@mui/material'
import {FC} from 'react'

import {colors} from '@/colors'
import {Marquee} from '@/components/Marquee/Marquee'
import {BannerAnimationContainer} from '@/utils/BannerAnimationProvider'

type BannerProps = {
  bannerMessages?: string[]
}

export const Banner: FC<BannerProps> = ({bannerMessages}) => {
  const {play, togglePlay} = BannerAnimationContainer.useContainer()

  const divider = '  -  '

  const bannerTextFormatted =
    bannerMessages && bannerMessages.length > 0
      ? Array(10).fill(bannerMessages).flat().join(divider) + divider
      : undefined

  if (!bannerTextFormatted) {
    return null
  }

  return (
    <Marquee
      gradient={false}
      speed={100}
      play={play}
      onClick={togglePlay}
      sx={{
        bgcolor: colors.black,
        color: colors.white,
        zIndex: 3,
        py: '0.2rem',
      }}
    >
      <Typography variant="h2" component="span" sx={{whiteSpace: 'nowrap'}}>
        {bannerTextFormatted}
      </Typography>
    </Marquee>
  )
}

import {Stack, Typography} from '@mui/material'
import {FC} from 'react'

import {Marquee} from '@/components/Marquee/Marquee'
import {colors} from '@/theme/colors'
import {BannerAnimationContainer} from '@/utils/BannerAnimationProvider'

type BannerProps = {
  bannerMessages?: string[]
}

export const Banner: FC<BannerProps> = ({bannerMessages}) => {
  const {play, togglePlay} = BannerAnimationContainer.useContainer()

  if (!bannerMessages || bannerMessages.length === 0) {
    return null
  }

  // ['1', '2'] -> ['1', '2', '1', '2', ...,  '1', '2'] (length 20)
  const multipliedMessages = Array.from({length: 10}, () => bannerMessages).flat()
  // ['1', '2', '1', '2', ...,  '1', '2'] (length 20) -> ['1', '-', '2', '-', ...,  '1', '-', '2', '-'] (length 40)
  const messages = multipliedMessages.flatMap((message) => [message, '-'])

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
      <Stack direction="row" gap={5} mr={5}>
        {messages.map((text, index) => (
          <Typography key={index} variant="h2" component="span" sx={{whiteSpace: 'pre'}}>
            {text}
          </Typography>
        ))}
      </Stack>
    </Marquee>
  )
}

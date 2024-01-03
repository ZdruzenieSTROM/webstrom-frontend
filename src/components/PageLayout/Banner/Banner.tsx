import {Box, Typography} from '@mui/material'
import {FC} from 'react'

import {Marquee} from '@/components/Marquee/Marquee'
import {BannerContainer} from '@/utils/BannerContainer'

export const Banner: FC = () => {
  const {bannerText} = BannerContainer.useContainer()

  return (
    <Box
      sx={{
        bgcolor: 'black',
        color: 'white',
        zIndex: 3,
        py: '0.2rem',
      }}
    >
      <Marquee gradient={false} speed={100}>
        <Typography variant="h2" component="span" sx={{whiteSpace: 'nowrap'}}>
          {bannerText || '\u00A0'}
        </Typography>
      </Marquee>
    </Box>
  )
}

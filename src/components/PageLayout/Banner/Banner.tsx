import {Box, Typography} from '@mui/material'
import {FC} from 'react'

import {Marquee} from '@/components/Marquee/Marquee'
import {BannerContainer} from '@/utils/BannerContainer'

export const Banner: FC = () => {
  const {bannerText} = BannerContainer.useContainer()

  return (
    <Box
      sx={{
        width: '100vw',
        bgcolor: 'black',
        color: 'white',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        zIndex: 3,
        mb: '0.5rem',
        p: '0.2rem 0',
      }}
    >
      <Marquee gradient={false} speed={100}>
        <Typography
          variant="h2"
          component="span"
          sx={{
            whiteSpace: 'nowrap',
            p: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {bannerText || '\u00A0'}
        </Typography>
      </Marquee>
    </Box>
  )
}

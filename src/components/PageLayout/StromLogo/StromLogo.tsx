import {Box} from '@mui/material'
import {FC} from 'react'

import Strom from '@/svg/strom-trimmed.svg'

export const StromLogo: FC = () => {
  return (
    <Box
      sx={{
        width: '70%',
        zIndex: -1,
        marginLeft: 'auto',
      }}
    >
      {/* TODO: vyriesit lepsie pre vysoke obrazovky :D nastavit nejak SVG ako background a nejake repeat-nieco? */}
      <Box>
        <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="black" />
      </Box>
      <Box>
        <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="black" />
      </Box>
      <Box>
        <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" color="black" />
      </Box>
    </Box>
  )
}

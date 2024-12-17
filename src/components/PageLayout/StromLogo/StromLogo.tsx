import {Box} from '@mui/material'
import {FC} from 'react'

import Strom from '@/svg/strom.svg'

import {HeaderHeightContainer} from '../Header/HeaderHeightContainer'

export const StromLogo: FC = () => {
  const {height} = HeaderHeightContainer.useContainer()

  return (
    <Box
      sx={{
        // NOTE (odstranit): 'sticky' (a bez width) ma inak tiez celkom zaujimavy vysledok
        position: 'fixed',
        width: '25%',
        // cisla odpovedaju top paddingom v `PageLayout` (dali by sa sem asi passnut zhora ci ukonstantovat)
        top: {xs: height + 32, md: height + 64, lg: height + 96},
        zIndex: -1,
      }}
    >
      {/* TODO: vyriesit lepsie :D nastavit nejak SVG ako background a nejake repeat-nieco? */}
      <Box>
        <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" />
      </Box>
      <Box>
        <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" />
      </Box>
      <Box>
        <Strom width="100%" height="100%" preserveAspectRatio="xMaxYMin" />
      </Box>
    </Box>
  )
}

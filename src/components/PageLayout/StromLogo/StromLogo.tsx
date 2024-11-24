import {Box} from '@mui/material'
import {FC} from 'react'

import Strom from '@/svg/strom.svg'

export const StromLogo: FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        // tieto cisla su take dost ad-hoc
        // je potrebne doratat este podla toho ze ci sa zobrazuje alebo nezobrazuje baner
        // taktiez pri sirke 900 - 1100px sa niektore nadpisy zalomuju a rozbijaju zarovnanie stromu
        // - problem toho je ze to je rozlisenie vacsinu tabletov na vysku, takze to bude treba fixnut
        top: {md: '213px', lg: '265px', xl: '301px'},
        left: 0,
        bottom: 0,
        width: '25%',
        paddingTop: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'end',
        zIndex: -1,
      }}
    >
      <Box>
        <Strom width="100%" height="auto" preserveAspectRatio="xMaxYMin" />
      </Box>
      <Box>
        <Strom width="100%" height="auto" preserveAspectRatio="xMaxYMin" />
      </Box>
    </Box>
  )
}

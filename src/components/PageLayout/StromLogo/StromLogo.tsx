import {Box, Button} from '@mui/material'
import {FC, useEffect, useRef, useState} from 'react'

import Strom from '@/svg/strom.svg'
import {BannerContainer} from '@/utils/BannerContainer'

export const StromLogo: FC = () => {
  const firstBoxRef = useRef<HTMLDivElement>(null)
  const [topPosition, setTopPosition] = useState(0)

  const {bannerMessages} = BannerContainer.useContainer()

  const updateTopPosition = () => {
    if (firstBoxRef.current) {
      const rect = firstBoxRef.current.getBoundingClientRect()
      setTopPosition(rect.top)
      console.log(rect.top)
    }
  }

  useEffect(() => {
    updateTopPosition()
    // toto sa prepocita skor ako sa baner zobrazi v plnej sirke, takze toto uplne nefunguje
    // dalsim problemom je ked sa zmeni nadpis (napriklad pri poradi prejdes z poradia semestra na seriu - zvacsi sa nadpis - banner sa posunie nizsie)
  }, [bannerMessages])

  return (
    <>
      {/* zistit pozicitu tohto boxu a nastavit to ako top pre box obsahujuci strom */}
      <Box ref={firstBoxRef}>
        <Button onClick={updateTopPosition}>Update top position</Button>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          // tieto cisla su take dost ad-hoc
          // je potrebne doratat este podla toho ze ci sa zobrazuje alebo nezobrazuje baner
          // taktiez pri sirke 900 - 1100px sa niektore nadpisy zalomuju a rozbijaju zarovnanie stromu
          // - problem toho je ze to je rozlisenie vacsinu tabletov na vysku, takze to bude treba fixnut
          // top: {md: '213px', lg: '265px', xl: '301px'},
          top: topPosition,
          left: 0,
          bottom: 0,
          width: '25%',
          // paddingTop: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          zIndex: -1,
        }}
      >
        <Box>
          {/* itenditfikovat vysku obrazovky a podla toho pasnut strom s potrebnym poctom trojuholnikov */}
          <Strom width="100%" height="auto" preserveAspectRatio="xMaxYMin" />
        </Box>
      </Box>
    </>
  )
}

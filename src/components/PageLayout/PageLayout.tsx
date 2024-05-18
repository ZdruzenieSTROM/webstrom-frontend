import {Stack} from '@mui/material'
// new MUI Grid without spacing issues: https://mui.com/material-ui/react-grid2/
// import {default as Grid} from '@mui/material/Unstable_Grid2'
import Grid from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
import {FC, ReactNode} from 'react'

import {BannerContainer} from '@/utils/BannerContainer'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {Seminar, useSeminarInfo} from '@/utils/useSeminarInfo'

import {Footer} from './Footer/Footer'
import {StromLogo} from './StromLogo/StromLogo'
import {TopGrid} from './TopGrid/TopGrid'

type PageLayoutProps = {
  contentWidth?: number
  title?: string
  children: ReactNode
}

const seminarTitle: Record<Seminar, string> = {
  strom: 'STROM',
  matik: 'Matik',
  malynar: 'Malynár',
}

// pre pouzitie len na seminarovych strankach a podstrankach - `/matik(/*)`
// ked budeme potrebovat top-level stranky ako `/ina-stranka`, budeme musiet upravit, ako sa pracuje s `useSeminarInfo`
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 2, title = '', children}) => {
  const {seminar} = useSeminarInfo()
  const browserTitlePrefix = title && `${title} | `
  const browserTitle = `${browserTitlePrefix}${seminarTitle[seminar]}`

  return (
    <>
      <Head>
        {/* mali sme tu pred zmenou warning, musi to byt jeden text child: `A title element received an array with more than 1 element as children.` */}
        <title>{browserTitle}</title>
      </Head>
      <PageTitleContainer.Provider initialState={title}>
        <BannerContainer.Provider>
          <Stack sx={{minHeight: '100vh', position: 'relative'}}>
            <TopGrid />
            <Stack sx={{justifyContent: 'space-between', position: 'relative', height: '100%'}}>
              <Grid container sx={{pb: 2, height: '100%'}}>
                <Grid xs={3} sx={{position: 'relative'}}>
                  <StromLogo />
                </Grid>
                <Grid xs={3 * contentWidth}>{children}</Grid>
              </Grid>
              <Footer />
            </Stack>
          </Stack>
        </BannerContainer.Provider>
      </PageTitleContainer.Provider>
    </>
  )
}

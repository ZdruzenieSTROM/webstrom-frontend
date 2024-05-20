import {Stack, SxProps} from '@mui/material'
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
  sx?: SxProps
}

const seminarTitle: Record<Seminar, string> = {
  strom: 'STROM',
  matik: 'Matik',
  malynar: 'Malynár',
}

// pre pouzitie len na seminarovych strankach a podstrankach - `/matik(/*)`
// ked budeme potrebovat top-level stranky ako `/ina-stranka`, budeme musiet upravit, ako sa pracuje s `useSeminarInfo`
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 2, title = '', children, sx}) => {
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
          <Stack sx={{minHeight: '100dvh'}}>
            <TopGrid />
            <Grid container sx={{flex: 1}}>
              <Grid xs={0} md={3} sx={{position: 'relative', display: {xs: 'none', md: 'block'}}}>
                <StromLogo />
              </Grid>
              <Grid xs={12} md={contentWidth * 3} sx={{pb: 2, px: 1, ...sx}}>
                {children}
              </Grid>
            </Grid>
            <Footer />
          </Stack>
        </BannerContainer.Provider>
      </PageTitleContainer.Provider>
    </>
  )
}

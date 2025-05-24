import {Box, Stack, SxProps} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
import {FC, ReactNode} from 'react'

import {BannerContainer} from '@/utils/BannerContainer'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {Seminar, useSeminarInfo} from '@/utils/useSeminarInfo'

import {Footer} from './Footer/Footer'
import {HeaderHeightContainer} from './Header/HeaderHeightContainer'
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
  const horizontalContentPadding = {xs: 4, md: 8, lg: 12}

  return (
    <>
      <Head>
        {/* mali sme tu pred zmenou warning, musi to byt jeden text child: `A title element received an array with more than 1 element as children.` */}
        <title>{browserTitle}</title>
      </Head>
      <PageTitleContainer.Provider initialState={title}>
        <BannerContainer.Provider>
          <HeaderHeightContainer.Provider>
            <Stack sx={{minHeight: '100dvh'}}>
              <TopGrid />
              <Stack sx={{flex: 1}}>
                <Box
                  sx={{
                    display: {xs: 'none', md: 'block'},
                    pt: horizontalContentPadding,
                    position: 'fixed',
                    width: '25%',
                  }}
                >
                  <StromLogo />
                </Box>

                <Grid container disableEqualOverflow sx={{flex: 1}}>
                  <Grid
                    xsOffset={0}
                    mdOffset={3}
                    xs={12}
                    md={contentWidth * 3}
                    sx={{
                      py: horizontalContentPadding,
                      px: 2,
                      ...sx,
                      // v server-renderi bol v consoli warning, ale first-child je tu asi uplne v pohode selector :D
                      // https://github.com/emotion-js/emotion/issues/1105#issuecomment-557726922
                      '> :first-child /* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */':
                        {mt: 0, pt: 0},
                    }}
                  >
                    {children}
                  </Grid>
                </Grid>
              </Stack>

              <Footer />
            </Stack>
          </HeaderHeightContainer.Provider>
        </BannerContainer.Provider>
      </PageTitleContainer.Provider>
    </>
  )
}

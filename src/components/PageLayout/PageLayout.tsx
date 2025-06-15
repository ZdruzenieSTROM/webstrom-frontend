import {Box, Grid2, Stack, SxProps} from '@mui/material'
import Head from 'next/head'
import {FC, ReactNode} from 'react'

import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {Seminar, useSeminarInfo} from '@/utils/useSeminarInfo'

import {Footer} from './Footer/Footer'
import {StromLogo} from './StromLogo/StromLogo'
import {TopGrid} from './TopGrid/TopGrid'

type PageLayoutProps = {
  contentWidth?: number
  title?: string
  bannerMessages?: string[]
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
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 2, title = '', bannerMessages, children, sx}) => {
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
        <Stack sx={{minHeight: '100dvh'}}>
          <TopGrid bannerMessages={bannerMessages} />
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

            <Grid2 container sx={{flex: 1}}>
              <Grid2
                offset={{xs: 0, md: 3}}
                size={{xs: 12, md: contentWidth * 3}}
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
              </Grid2>
            </Grid2>
          </Stack>

          <Footer />
        </Stack>
      </PageTitleContainer.Provider>
    </>
  )
}

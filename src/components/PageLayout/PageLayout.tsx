import {Box, Grid, Stack, SxProps} from '@mui/material'
import Head from 'next/head'
import {FC, ReactNode} from 'react'

import {colors} from '@/theme/colors'
import {Seminar, useSeminarInfo} from '@/utils/useSeminarInfo'

import {Footer} from './Footer/Footer'
import {StromLogo} from './StromLogo/StromLogo'
import {TopGrid} from './TopGrid/TopGrid'

type PageLayoutProps = {
  contentWidth?: number
  title?: string
  subtitle?: string
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
export const PageLayout: FC<PageLayoutProps> = ({
  contentWidth = 2,
  title = '',
  subtitle,
  bannerMessages,
  children,
  sx,
}) => {
  const {seminar} = useSeminarInfo()
  const combinedTitle = subtitle ? `${subtitle} - ${title}` : title
  const browserTitlePrefix = combinedTitle && `${combinedTitle} | `
  const browserTitle = `${browserTitlePrefix}${seminarTitle[seminar]}`
  const description = `${seminarTitle[seminar]} - korešpondenčný seminár`
  const shareImagePath = '/og/strom-share.png'
  const horizontalContentPadding = {xs: 4, md: 8, lg: 12}

  return (
    <>
      <Head>
        {/* mali sme tu pred zmenou warning, musi to byt jeden text child: `A title element received an array with more than 1 element as children.` */}
        <title>{browserTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={seminarTitle[seminar]} />
        <meta property="og:title" content={browserTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={shareImagePath} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${seminarTitle[seminar]} logo`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={browserTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={shareImagePath} />
      </Head>
      <Stack sx={{minHeight: '100dvh', backgroundColor: colors.white}}>
        <TopGrid title={title} subtitle={subtitle} bannerMessages={bannerMessages} />
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

          <Grid container sx={{flex: 1}}>
            <Grid
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
            </Grid>
          </Grid>
        </Stack>

        <Footer />
      </Stack>
    </>
  )
}

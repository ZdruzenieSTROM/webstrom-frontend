import {CssBaseline} from '@mui/material'
import {ThemeProvider} from '@mui/material/styles'
import {DehydratedState, HydrationBoundary} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {AppProps} from 'next/app'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {CookiesProvider} from 'react-cookie'

import {AlertBox} from '@/components/Alert/AlertBox'
import {theme} from '@/theme/theme'
import {AlertContainer} from '@/utils/AlertContainer'
import {AuthContainer} from '@/utils/AuthContainer'
import {BannerAnimationContainer} from '@/utils/BannerAnimationProvider'
import {ReactQueryProvider} from '@/utils/ReactQueryProvider'

type PageProps = {dehydratedState: DehydratedState}

const MyApp: FC<AppProps<PageProps>> = ({Component, pageProps}) => {
  const router = useRouter()
  const isAdminRoute = router.pathname.startsWith('/admin')

  return (
    <>
      <Head>
        <title>STROM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AlertContainer.Provider>
        <ReactQueryProvider>
          <HydrationBoundary state={pageProps.dehydratedState}>
            {/* Admin defines its own DevTools because it also has its own queryClient */}
            {!isAdminRoute && <ReactQueryDevtools />}
            <CookiesProvider>
              <AuthContainer.Provider>
                <BannerAnimationContainer.Provider>
                  <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AlertBox />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </BannerAnimationContainer.Provider>
              </AuthContainer.Provider>
            </CookiesProvider>
          </HydrationBoundary>
        </ReactQueryProvider>
      </AlertContainer.Provider>
    </>
  )
}

export default MyApp

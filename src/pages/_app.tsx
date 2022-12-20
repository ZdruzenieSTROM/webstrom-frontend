import '../index.scss'

import {createTheme, ThemeProvider} from '@mui/material'
import {AppProps} from 'next/app'
import Head from 'next/head'
import {FC} from 'react'
import {CookiesProvider} from 'react-cookie'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

import {AuthContainer} from '@/utils/AuthContainer'
import {ProfileContainer} from '@/utils/ProfileContainer'

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
})

const queryClient = new QueryClient()

const MyApp: FC<AppProps> = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>React App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <CookiesProvider>
          <ProfileContainer.Provider>
            <AuthContainer.Provider>
              <ThemeProvider theme={theme}>
                <Component {...pageProps} />
              </ThemeProvider>
            </AuthContainer.Provider>
          </ProfileContainer.Provider>
        </CookiesProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp

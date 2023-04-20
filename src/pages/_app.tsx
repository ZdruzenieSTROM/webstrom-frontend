import '../index.scss'

import {createTheme, ThemeProvider} from '@mui/material'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {isAxiosError} from 'axios'
import {AppProps} from 'next/app'
import Head from 'next/head'
import {FC} from 'react'
import {CookiesProvider} from 'react-cookie'

import {AuthContainer} from '@/utils/AuthContainer'

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      // globalny error handler requestov cez useMutation
      // notes:
      // - axios vzdy sam loguje error do konzole, my nemusime
      // - specifikovanim `onError` na nejakej `useMutation` sa tento handler prepise, tak sa tomu vyhybajme
      // - ak nemame vlastny message v `.detail`, ukazeme userovi kludne original anglicku hlasku z `error` - aspon nam potom bude vediet povedat, co presne sa deje
      onError: (error) => {
        if (isAxiosError(error)) {
          const data = error.response?.data
          const detail = typeof data === 'object' && data && 'detail' in data && data.detail
          alert(typeof detail === 'string' ? detail : error)
        } else {
          alert(error)
        }
      },
    },
  },
})

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
          <AuthContainer.Provider>
            <ThemeProvider theme={theme}>
              <Component {...pageProps} />
            </ThemeProvider>
          </AuthContainer.Provider>
        </CookiesProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp

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
      // - useMutation vzdy sam loguje error do konzoly, my nemusime
      // - specifikovanim `onError` na nejakej `useMutation` sa tento handler prepise, tak sa tomu vyhybajme
      onError: (error) => {
        if (isAxiosError(error)) {
          const data = error.response?.data as unknown
          if (typeof data === 'object' && data) {
            // ak mame vlastny message v `.detail`, ukazeme userovi ten
            const detail = 'detail' in data && data.detail
            if (typeof detail === 'string') {
              alert(detail)
              return
            }

            // ak nie, ale mame message v `.non_field_errors`, ukazeme ten
            const nonFieldErrors = 'non_field_errors' in data && data.non_field_errors
            const nonFieldError = Array.isArray(nonFieldErrors) && (nonFieldErrors as unknown[])[0]
            if (typeof nonFieldError === 'string') {
              alert(nonFieldError)
              return
            }

            // TODO: handle field errors (napr. na password) - nealertovat usera, ale zobrazit v UI? alebo alert s prvym field errorom

            // ak nie, ukazeme kludne original anglicku hlasku z `error`u
            alert(error)
            return
          }
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

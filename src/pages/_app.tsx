import {CssBaseline} from '@mui/material'
import {ThemeProvider} from '@mui/material/styles'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {isAxiosError} from 'axios'
import {AppProps} from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import {FC, PropsWithChildren, useMemo} from 'react'
import {CookiesProvider} from 'react-cookie'

import {AlertBox} from '@/components/Alert/AlertBox'
import {theme} from '@/theme'
import {AlertContainer} from '@/utils/AlertContainer'
import {AuthContainer} from '@/utils/AuthContainer'
import {useAlert} from '@/utils/useAlert'

const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(({ReactQueryDevtools}) => ReactQueryDevtools),
  {
    ssr: false,
  },
)

const ReactQueryProvider: FC<PropsWithChildren> = ({children}) => {
  const {alert} = useAlert()

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (isAxiosError(error)) {
                // nechceme retryovat 403 (Forbidden)
                const status = error.response?.status
                if (status === 403 || status === 404) return false
              }
              // klasika - retryuj len 3x
              if (failureCount >= 3) return false
              return true
            },
          },
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
                  const nonFieldErrorsUnknown = Array.isArray(nonFieldErrors) ? (nonFieldErrors as unknown[]) : []
                  const nonFieldErrorsJoined = nonFieldErrorsUnknown.every((e) => typeof e === 'string')
                    ? nonFieldErrorsUnknown.join('\n')
                    : ''
                  if (nonFieldErrorsJoined) {
                    alert(nonFieldErrorsJoined)
                    return
                  }

                  // TODO: handle field errors (napr. na password) - nealertovat usera, ale zobrazit v UI? alebo alert s prvym field errorom

                  // ak nie, ukazeme kludne original anglicku hlasku z `error`u
                  alert(error.message)
                  return
                }
              } else {
                alert(error.message)
              }
            },
          },
        },
      }),
    [alert],
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const MyApp: FC<AppProps> = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>STROM</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* ak pouzijeme vsade <Typography>, nemuseli by sme mat takyto globalny styl... ale je to teda
          safe a krajsie, nech kazdy maly (aj debug) textik je aspon nasim fontom a ne v Times :D
          source: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts#apply-the-font-in-head */}
      <style jsx global>{`
        html {
          font-family: ${theme.typography.fontFamily};
        }
      `}</style>
      <AlertContainer.Provider>
        <ReactQueryProvider>
          <ReactQueryDevtools />
          <CookiesProvider>
            <AuthContainer.Provider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AlertBox />
                <Component {...pageProps} />
              </ThemeProvider>
            </AuthContainer.Provider>
          </CookiesProvider>
        </ReactQueryProvider>
      </AlertContainer.Provider>
    </>
  )
}

export default MyApp

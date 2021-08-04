import '../../src/index.css'
import '@/components/Latex/Latex.css'
import '@/components/Latex/LatexExample.css'
import '@/components/ScrollingText/ScrollingText.scss'
import '@/components/Marquee/Marquee.scss'
import '@/components/Post/Post.css'
import '@/components/PagePlaceholder/PagePlaceholder.css'
import '@/components/Overlay/Overlay.scss'
import '@/components/PageLayout/MenuSeminars/MenuSeminars.css'
import '@/components/PageLayout/Footer/Footer.css'
import '@/components/PageLayout/LoginForm/LoginForm.scss'
import '@/components/PageLayout/Authentication/Authentication.scss'
import '@/components/RegisterForm/RegisterForm.css'
import '@/components/PageLayout/MenuMain/MenuMain.css'

import axios, {AxiosError} from 'axios'
import {AppProps} from 'next/app'
import Head from 'next/head'
import {FC, useEffect} from 'react'
import {Cookies, useCookies} from 'react-cookie'

const cookies = new Cookies()

axios.interceptors.request.use((request) => {
  // Interceptor ktorý pridá webstrom-token do autorizačného headera
  const key = cookies.get('webstrom-token')
  if (key !== undefined) {
    request.headers.Authorization = `Token ${key}`
  }
  return request
})

const MyApp: FC<AppProps> = ({Component, pageProps}) => {
  const [, , removeCookie] = useCookies(['webstrom-token', 'webstrom-name'])

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status

        if (status === 401) {
          // Nesprávny webstrom-token vráti 401. V tomto prápade sa zrušia cookies ktoré
          // ukladajú informácie o userovi, zruší sa autorizačný header a prepošle sa request.

          removeCookie('webstrom-token', {path: '/'})
          removeCookie('webstrom-name', {path: '/'})

          const originalRequestConfig = error.config
          delete originalRequestConfig.headers.Authorization

          return axios.request(originalRequestConfig)
        }

        return Promise.reject(error)
      },
    )
    // removeCookie funkcia je definovaná pomocou useCookies hooku a preto sa nedá
    // presunúť do useEffect. Preto skutočne nemá byť v dependency liste.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>React App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

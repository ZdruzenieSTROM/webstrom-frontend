import '../index.scss'
import '@/components/Latex/Latex.css'
import '@/components/Latex/LatexExample.css'
import '@/components/Marquee/Marquee.scss'
import '@/components/Post/Post.css'
import '@/components/PagePlaceholder/PagePlaceholder.css'

import {AppProps} from 'next/app'
import Head from 'next/head'
import {FC} from 'react'
import {CookiesProvider} from 'react-cookie'

import {AuthContainer} from '@/utils/AuthContainer'
import {ProfileContainer} from '@/utils/ProfileContainer'

const MyApp: FC<AppProps> = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>React App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CookiesProvider>
        <ProfileContainer.Provider>
          <AuthContainer.Provider>
            <Component {...pageProps} />
          </AuthContainer.Provider>
        </ProfileContainer.Provider>
      </CookiesProvider>
    </>
  )
}

export default MyApp

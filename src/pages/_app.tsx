import '../index.scss'
import '@/components/Latex/Latex.css'
import '@/components/Latex/LatexExample.css'
import '@/components/Marquee/Marquee.scss'
import '@/components/Post/Post.css'
import '@/components/PagePlaceholder/PagePlaceholder.css'
import '@/components/RegisterForm/RegisterForm.css'

import {AppProps} from 'next/app'
import Head from 'next/head'
import {FC} from 'react'

import {UserContainer} from '@/utils/UserContainer'
import {WebstromTokenContainer} from '@/utils/WebstromTokenContainer'

const MyApp: FC<AppProps> = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>React App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <WebstromTokenContainer.Provider>
        {/* UserContainer needs to be a child of WebstromTokenContainer */}
        <UserContainer.Provider>
          <Component {...pageProps} />
        </UserContainer.Provider>
      </WebstromTokenContainer.Provider>
    </>
  )
}

export default MyApp

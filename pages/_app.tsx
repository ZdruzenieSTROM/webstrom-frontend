import '../src/index.css'
import '../src/components/Latex/Latex.css'
import '../src/components/Latex/LatexExample.css'
import '../src/components/ScrollingText/ScrollingText.scss'
import '../src/components/Marquee/Marquee.scss'
import '../src/pages/Post/Post.css'
import '../src/pages/PagePlaceholder/PagePlaceholder.css'
import '../src/components/Overlay/Overlay.scss'
import '../src/components/PageLayout/components/MenuSeminars.css'
import '../src/components/PageLayout/components/Footer.css'
import '../src/components/PageLayout/components/LoginForm.scss'
import '../src/components/PageLayout/components/Authentication.scss'
import '../src/pages/RegisterForm/RegisterForm.css'
import '../src/components/PageLayout/components/MenuMain.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps}) {
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

import clsx from 'clsx'
import Head from 'next/head'
import {FC, ReactNode} from 'react'

import {BannerContainer} from '@/utils/BannerContainer'
import {PageTitleContainer} from '@/utils/PageTitleContainer'
import {Seminar, useSeminarInfo} from '@/utils/useSeminarInfo'

import {Footer} from './Footer/Footer'
import {MenuMain} from './MenuMain/MenuMain'
import styles from './PageLayout.module.scss'
import {StromLogo} from './StromLogo/StromLogo'
import {TopGrid} from './TopGrid/TopGrid'

type PageLayoutProps = {
  contentWidth?: number
  title?: string
  children: ReactNode
}

const seminarTitle: Record<Seminar, string> = {
  strom: 'STROM',
  matik: 'Matik',
  malynar: 'Malynár',
}

// pre pouzitie len na seminarovych strankach a podstrankach - `/matik(/*)`
// ked budeme potrebovat top-level stranky ako `/ina-stranka`, budeme musiet upravit, ako sa pracuje s `useSeminarInfo`
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 2, title = '', children}) => {
  const {seminar} = useSeminarInfo()
  const browserTitlePrefix = title && `${title} | `
  const browserTitle = `${browserTitlePrefix}${seminarTitle[seminar]}`

  return (
    <>
      <Head>
        {/* mali sme tu pred zmenou warning, musi to byt jeden text child: `A title element received an array with more than 1 element as children.` */}
        <title>{browserTitle}</title>
      </Head>
      <PageTitleContainer.Provider initialState={title}>
        <BannerContainer.Provider>
          <div className={styles.pageContainer}>
            <TopGrid />
            <MenuMain />
            <StromLogo />
            <div className={styles.grid}>
              <div
                className={clsx(
                  styles.mainContent,
                  contentWidth === 1 && styles.col1,
                  contentWidth === 2 && styles.col2,
                  contentWidth === 3 && styles.col3,
                )}
              >
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </BannerContainer.Provider>
      </PageTitleContainer.Provider>
    </>
  )
}

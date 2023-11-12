import clsx from 'clsx'
import {FC, ReactNode} from 'react'

import {BannerContainer} from '@/utils/BannerContainer'
import {PageTitleContainer} from '@/utils/PageTitleContainer'

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

// pre pouzitie len na seminarovych strankach a podstrankach - `/matik(/*)`
// ked budeme potrebovat top-level stranky ako `/ina-stranka`, budeme musiet upravit, ako sa pracuje s `useSeminarInfo`
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 2, title = '', children}) => {
  return (
    <PageTitleContainer.Provider initialState={title}>
      <BannerContainer.Provider>
        <div className={styles.pageContainer}>
          <TopGrid />
          <MenuMain />
          <div className={styles.grid}>
            <StromLogo />
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
  )
}

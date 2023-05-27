import clsx from 'clsx'
import {FC, ReactNode} from 'react'

import {Banner} from './Banner/Banner'
import {Footer} from './Footer/Footer'
import {MenuMain} from './MenuMain/MenuMain'
import {MenuSeminars} from './MenuSeminars/MenuSeminars'
import styles from './PageLayout.module.scss'
import {StromLogo} from './StromLogo/StromLogo'

type PageLayoutProps = {
  contentWidth?: number
  title?: string
  children: ReactNode
}

// pre pouzitie len na seminarovych strankach a podstrankach - `/matik(/*)`
// ked budeme potrebovat top-level stranky ako `/ina-stranka`, budeme musiet upravit, ako sa pracuje s `useSeminarInfo`
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 3, title = '', children}) => {
  return (
    <div className={styles.pageContainer}>
      <MenuSeminars title={title} />
      <Banner />
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
  )
}

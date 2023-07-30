import clsx from 'clsx'
import {FC, ReactNode, useEffect} from 'react'

import {PageTitleContainer} from '@/utils/PageTitleContainer'

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
export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 2, title = '', children}) => {
  const {pageTitle, setPageTitle} = PageTitleContainer.useContainer()

  useEffect(() => {
    if (title !== '') setPageTitle(title)
  }, [contentWidth, title, setPageTitle])

  return (
    <div className={styles.pageContainer}>
      <MenuSeminars title={pageTitle} />
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

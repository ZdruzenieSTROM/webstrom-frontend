import clsx from 'clsx'
import {FC} from 'react'

import {Banner} from './Banner/Banner'
import {Footer} from './Footer/Footer'
import {MenuMain} from './MenuMain/MenuMain'
import {MenuSeminars} from './MenuSeminars/MenuSeminars'
import styles from './PageLayout.module.scss'
import {StromLogo} from './StromLogo/StromLogo'

type PageLayoutProps = {
  contentWidth?: number
  title?: string
}

export const PageLayout: FC<PageLayoutProps> = ({contentWidth = 3, title = '', children}) => {
  return (
    <div className={styles.pageContainer}>
      <MenuSeminars title={title} />
      <Banner />
      <MenuMain />
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
      <Footer />
    </div>
  )
}

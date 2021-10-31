import clsx from 'clsx'
import {useRouter} from 'next/router'
import {FC, useEffect, useState} from 'react'

import {Banner} from './Banner/Banner'
import {Footer} from './Footer/Footer'
import {MenuMain} from './MenuMain/MenuMain'
import {MenuSeminars} from './MenuSeminars/MenuSeminars'
import styles from './PageLayout.module.scss'
import {StromLogo} from './StromLogo/StromLogo'

export const PageLayout: FC<{contentWidth?: number; title?: string}> = ({contentWidth = 3, title = '', children}) => {
  const router = useRouter()
  const [seminarId, setSeminarId] = useState(0)

  useEffect(() => {
    switch (router.pathname.slice(1).split('/', 1)[0]) {
      case 'strom':
        if (seminarId !== 0) {
          setSeminarId(0)
        }
        break
      case 'matik':
        if (seminarId !== 1) {
          setSeminarId(1)
        }
        break
      case 'malynar':
        if (seminarId !== 2) {
          setSeminarId(2)
        }
        break
    }
  }, [router.pathname, seminarId])

  return (
    <>
      <div className={styles.pageContainer}>
        <MenuSeminars seminarId={seminarId} title={title} />
        <Banner />
        <MenuMain seminarId={seminarId} />
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
    </>
  )
}

import Link from 'next/link'
import {FC} from 'react'

import styles from './MenuSeminars.module.scss'

export const MenuSeminars: FC<{seminarId: number; title: string}> = ({seminarId, title}) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={seminarId === 2 ? `${styles.menu_item} ${styles.active}` : styles.menu_item}>
          <Link href="/malynar">
            <a>Malynár</a>
          </Link>
        </div>
        <div className={seminarId === 1 ? `${styles.menu_item} ${styles.active}` : styles.menu_item}>
          <Link href="/matik">
            <a>Matik</a>
          </Link>
        </div>
        <div className={seminarId === 0 ? `${styles.menu_item} ${styles.active}` : styles.menu_item}>
          <Link href="/strom">
            <a>Strom</a>
          </Link>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  )
}

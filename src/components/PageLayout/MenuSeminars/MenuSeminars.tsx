import clsx from 'clsx'
import Link from 'next/link'
import {FC} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import styles from './MenuSeminars.module.scss'

type MenuSeminarsProps = {
  title: string
}

export const MenuSeminars: FC<MenuSeminarsProps> = ({title}) => {
  const {seminar} = useSeminarInfo()

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={clsx(styles.menu_item, seminar === 'malynar' && styles.active)}>
          <Link href="/malynar">
            <a>Malynár</a>
          </Link>
        </div>
        <div className={clsx(styles.menu_item, seminar === 'matik' && styles.active)}>
          <Link href="/matik">
            <a>Matik</a>
          </Link>
        </div>
        <div className={clsx(styles.menu_item, seminar === 'strom' && styles.active)}>
          <Link href="/strom">
            <a>Strom</a>
          </Link>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  )
}

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
        <div className={clsx(styles.menuItem, seminar === 'malynar' && styles.active)}>
          <Link href="/malynar">Malynár</Link>
        </div>
        <div className={clsx(styles.menuItem, seminar === 'matik' && styles.active)}>
          <Link href="/matik">Matik</Link>
        </div>
        <div className={clsx(styles.menuItem, seminar === 'strom' && styles.active)}>
          <Link href="/strom">Strom</Link>
        </div>
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  )
}

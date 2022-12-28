import {FC, ReactNode} from 'react'

import styles from './SideContainer.module.scss'

export const SideContainer: FC<{title: string; children: ReactNode}> = ({title, children}) => {
  return (
    <aside className={styles.container}>
      <div className={styles.title}>{title}</div>
      {children}
    </aside>
  )
}

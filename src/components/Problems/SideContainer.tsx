import {FC} from 'react'

import styles from './SideContainer.module.scss'

export const SideContainer: FC<{title: string}> = ({title, children}) => {
  return (
    <div className={styles.sideContentContainer}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  )
}

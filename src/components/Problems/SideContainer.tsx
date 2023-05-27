import {FC, ReactNode} from 'react'

import {CloseButton} from '../CloseButton/CloseButton'
import styles from './SideContainer.module.scss'

export const SideContainer: FC<{title: string; children: ReactNode; onClose: () => void}> = ({
  title,
  children,
  onClose,
}) => {
  return (
    <aside className={styles.container}>
      <div className={styles.title}>
        <CloseButton onClick={onClose} alignRight />
        <span>{title}</span>
      </div>
      {children}
    </aside>
  )
}

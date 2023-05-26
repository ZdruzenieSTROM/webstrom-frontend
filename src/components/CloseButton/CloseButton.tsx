import {FC, useEffect, useState} from 'react'
import * as CgIcons from 'react-icons/cg'

import styles from './CloseButton.module.scss'

interface CloseButtonProps {
  onClick: () => void
}

export const CloseButton: FC<CloseButtonProps> = ({onClick}) => {
  return (
    <div className={styles.menuCloseButton}>
      <CgIcons.CgClose className={styles.menuCloseButton} onClick={onClick} />
    </div>
  )
}

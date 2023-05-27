import {FC, useEffect, useState} from 'react'
import * as CgIcons from 'react-icons/cg'

import styles from './CloseButton.module.scss'

interface CloseButtonProps {
  onClick: () => void
  align: string
}

const alignClass: {[key: string]: string} = {
  left: styles.closeButton__left,
  right: styles.closeButton__right,
}

export const CloseButton: FC<CloseButtonProps> = ({onClick, align}) => {
  return (
    <div className={`${styles.closeButton} ${alignClass[align]}`}>
      <CgIcons.CgClose onClick={onClick} />
    </div>
  )
}

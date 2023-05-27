import clsx from 'clsx'
import {FC} from 'react'
import * as CgIcons from 'react-icons/cg'

import styles from './CloseButton.module.scss'

interface CloseButtonProps {
  onClick: () => void
  align: string
}

const alignClass: {[key: string]: string} = {
  left: styles.closeButtonLeft,
  right: styles.closeButtonRight,
}

export const CloseButton: FC<CloseButtonProps> = ({onClick, align}) => {
  return (
    <div className={clsx(styles.closeButton, alignClass[align])}>
      <CgIcons.CgClose onClick={onClick} />
    </div>
  )
}

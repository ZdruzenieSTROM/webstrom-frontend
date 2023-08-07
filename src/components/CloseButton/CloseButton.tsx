import clsx from 'clsx'
import {FC} from 'react'

import Close from '@/svg/close.svg'

import styles from './CloseButton.module.scss'

interface CloseButtonProps {
  onClick: () => void
  size: number
  invertColors?: boolean
  className?: string
}

export const CloseButton: FC<CloseButtonProps> = ({onClick, size, invertColors, className}) => {
  return (
    <div className={clsx(styles.closeButton, invertColors && styles.invertColors, className)} onClick={onClick}>
      <Close width={size} height={size} />
    </div>
  )
}

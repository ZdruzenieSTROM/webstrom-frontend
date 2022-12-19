import clsx from 'clsx'
import {FC} from 'react'

import styles from './Clickable.module.scss'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
}

export const Button: FC<ButtonProps> = ({children, onClick, disabled}) => {
  return (
    <span onClick={onClick} className={clsx(styles.actionButton, disabled && styles.disabled)}>
      {children}
    </span>
  )
}

interface LinkProps {
  href: string
  disabled?: boolean
}

export const Link: FC<LinkProps> = ({children, href, disabled}) => {
  return (
    <a href={href} className={clsx(styles.actionButton, disabled && styles.disabled)}>
      {children}
    </a>
  )
}

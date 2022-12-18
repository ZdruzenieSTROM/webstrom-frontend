import clsx from 'clsx'
import {FC} from 'react'

import styles from './Clickable.module.scss'

interface ButtonProps {
  onClick?: () => void
  active?: boolean
}

export const Button: FC<ButtonProps> = ({children, onClick, active}) => {
  return (
    <span onClick={onClick} className={clsx(styles.actionButton, active && styles.disabled)}>
      {children}
    </span>
  )
}

interface LinkProps {
  href: string
  active?: boolean
}

export const Link: FC<LinkProps> = ({children, href, active}) => {
  return (
    <a href={href} className={clsx(styles.actionButton, active && styles.disabled)}>
      {children}
    </a>
  )
}

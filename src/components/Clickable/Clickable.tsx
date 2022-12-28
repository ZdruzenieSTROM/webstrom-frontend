import clsx from 'clsx'
import NextLink from 'next/link'
import {FC, ReactNode} from 'react'

import styles from './Clickable.module.scss'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
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
  children: ReactNode
}

export const Link: FC<LinkProps> = ({children, href, disabled}) => {
  return (
    <NextLink href={href} className={clsx(styles.actionButton, disabled && styles.disabled)}>
      {children}
    </NextLink>
  )
}

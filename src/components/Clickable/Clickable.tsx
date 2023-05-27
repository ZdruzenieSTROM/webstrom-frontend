import clsx from 'clsx'
import NextLink from 'next/link'
import {ButtonHTMLAttributes, FC, ReactNode} from 'react'

import styles from './Clickable.module.scss'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export const Button: FC<ButtonProps> = ({children, onClick, disabled, type}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(styles.actionButton, disabled && styles.disabled)}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

interface LinkProps {
  href?: string
  disabled?: boolean
  children: ReactNode[]
}

export const Link: FC<LinkProps> = ({children, href, disabled}) => {
  // https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
  return disabled ? (
    <a className={clsx(styles.actionButton, styles.disabled)} aria-disabled role="link">
      {children}
    </a>
  ) : (
    <NextLink href={href ?? ''} className={clsx(styles.actionButton)}>
      {children}
    </NextLink>
  )
}

import clsx from 'clsx'
import NextLink from 'next/link'
import {ButtonHTMLAttributes, ComponentProps, FC, ReactNode} from 'react'

import styles from './Clickable.module.scss'

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

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

type LinkProps = {
  href?: string
  disabled?: boolean
  children: ReactNode
} & Pick<ComponentProps<typeof NextLink>, 'target'>

export const Link: FC<LinkProps> = ({children, href, disabled, target}) => {
  // https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
  return disabled ? (
    <a className={clsx(styles.actionButton, styles.disabled)} aria-disabled role="link">
      {children}
    </a>
  ) : (
    <NextLink href={href ?? ''} target={target} className={clsx(styles.actionButton)}>
      {children}
    </NextLink>
  )
}

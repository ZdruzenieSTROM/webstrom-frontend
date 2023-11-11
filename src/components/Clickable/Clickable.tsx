import {Typography} from '@mui/material'
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
    <Typography
      variant="button3"
      component="button"
      onClick={onClick}
      className={clsx(styles.actionButton, disabled && styles.disabled)}
      disabled={disabled}
      type={type}
    >
      {children}
    </Typography>
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
    <Typography
      variant="button3"
      component="a"
      className={clsx(styles.actionButton, styles.disabled)}
      aria-disabled
      role="link"
    >
      {children}
    </Typography>
  ) : (
    <Typography
      variant="button3"
      component={NextLink}
      href={href ?? ''}
      target={target}
      className={clsx(styles.actionButton)}
    >
      {children}
    </Typography>
  )
}

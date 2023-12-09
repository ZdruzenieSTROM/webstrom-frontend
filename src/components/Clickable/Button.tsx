import {Typography, TypographyProps} from '@mui/material'
import clsx from 'clsx'
import {ButtonHTMLAttributes, FC, ReactNode} from 'react'

import styles from './Clickable.module.scss'

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  variant?: TypographyProps['variant']
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export const Button: FC<ButtonProps> = ({children, onClick, disabled, type, variant}) => {
  return (
    <Typography
      variant={variant ?? 'button3'}
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

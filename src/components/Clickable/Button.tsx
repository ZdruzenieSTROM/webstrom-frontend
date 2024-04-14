import {SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import {ButtonHTMLAttributes, FC, ReactNode} from 'react'

import {buttonCommonSx, buttonDisabledSx} from './buttonStyles'

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  variant?: TypographyProps['variant']
  sx?: SxProps<Theme>
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export const Button: FC<ButtonProps> = ({children, onClick, disabled, type, variant, sx}) => {
  return (
    <Typography
      variant={variant ?? 'button3'}
      component="button"
      onClick={onClick}
      disabled={disabled}
      type={type}
      sx={{
        ...buttonCommonSx,
        ...(disabled ? buttonDisabledSx : {}),
        ...sx,
      }}
    >
      {children}
    </Typography>
  )
}

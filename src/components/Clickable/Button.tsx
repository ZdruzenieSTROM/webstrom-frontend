import {Box, SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import {ButtonHTMLAttributes, FC, ReactNode} from 'react'

import {buttonTextSx, getButtonWrapperSx} from './buttonStyles'

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  variant?: TypographyProps['variant']
  invertColors?: boolean
  sx?: SxProps<Theme>
  textSx?: SxProps<Theme>
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export const Button: FC<ButtonProps> = ({children, onClick, disabled, type, variant, invertColors, sx, textSx}) => {
  return (
    // tento wrapper je tu kvoli lepsej kontrole paddingov atd.
    <Box
      component="button"
      onClick={onClick}
      disabled={disabled}
      type={type}
      sx={{
        ...getButtonWrapperSx({invertColors, disabled}),
        ...sx,
      }}
    >
      <Typography
        variant={variant ?? 'button3'}
        sx={{
          ...buttonTextSx,
          ...textSx,
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

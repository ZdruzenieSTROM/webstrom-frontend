import {Box, Stack, SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode} from 'react'

import {buttonInnerSx, getButtonWrapperSx} from './buttonStyles'

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  disabledTooltip?: string
  children?: ReactNode
  endElement?: ReactNode
  variant?: TypographyProps['variant']
  invertColors?: boolean
  sx?: SxProps<Theme>
  textSx?: SxProps<Theme>
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export const Button: FC<ButtonProps> = ({
  children,
  endElement,
  onClick,
  disabled,
  disabledTooltip,
  type,
  variant,
  invertColors,
  sx,
  textSx,
}) => {
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
      <Stack
        direction="row"
        // toto pridava bottom border
        sx={buttonInnerSx}
      >
        <Tooltip title={disabled ? disabledTooltip : ''}>
          <Typography variant={variant ?? 'button3'} sx={textSx}>
            {children}
          </Typography>
        </Tooltip>
        {endElement}
      </Stack>
    </Box>
  )
}

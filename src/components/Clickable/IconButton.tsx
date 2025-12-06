import {IconButton as MuiIconButton, SxProps, Theme} from '@mui/material'
import {FC, ReactNode} from 'react'

import {getButtonWrapperSx} from './buttonStyles'

type IconButtonProps = {
  href: string
  'aria-label': string
  children: ReactNode
  invertColors?: boolean
  sx?: SxProps<Theme>
}

export const IconButton: FC<IconButtonProps> = ({href, 'aria-label': ariaLabel, children, invertColors, sx}) => {
  return (
    <MuiIconButton
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      sx={{
        ...getButtonWrapperSx({invertColors, withoutPaddingChanges: true}),
        ...sx,
      }}
    >
      {children}
    </MuiIconButton>
  )
}

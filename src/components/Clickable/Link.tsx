import {Box, SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import NextLink from 'next/link'
import {ComponentProps, FC, ReactNode} from 'react'

import {buttonInnerSx, getButtonWrapperSx} from './buttonStyles'

type LinkProps = {
  href?: string
  disabled?: boolean
  children: ReactNode
  variant?: TypographyProps['variant']
  invertColors?: boolean
  active?: boolean
  sx?: SxProps<Theme>
  textSx?: SxProps<Theme>
} & Pick<ComponentProps<typeof NextLink>, 'target'>

export const Link: FC<LinkProps> = ({children, href, disabled, target, variant, invertColors, active, sx, textSx}) => {
  if (disabled) {
    return (
      <Box
        sx={{
          ...getButtonWrapperSx({invertColors, disabled, active}),
          ...sx,
        }}
      >
        {/* https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link */}
        <Typography
          variant={variant ?? 'button3'}
          component="a"
          aria-disabled
          role="link"
          sx={{
            ...buttonInnerSx,
            ...textSx,
          }}
        >
          {children}
        </Typography>
      </Box>
    )
  }

  return (
    // tento wrapper je tu kvoli lepsej kontrole paddingov atd.
    <Box
      component={NextLink}
      href={href ?? ''}
      target={target}
      sx={{
        ...getButtonWrapperSx({invertColors, disabled, active}),
        ...sx,
      }}
    >
      <Typography
        variant={variant ?? 'button3'}
        sx={{
          ...buttonInnerSx,
          ...textSx,
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

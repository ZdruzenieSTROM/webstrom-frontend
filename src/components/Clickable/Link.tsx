import {SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import NextLink from 'next/link'
import {ComponentProps, FC, ReactNode} from 'react'

import {buttonCommonSx, buttonDisabledSx} from './buttonStyles'

type LinkProps = {
  href?: string
  disabled?: boolean
  children: ReactNode
  variant?: TypographyProps['variant']
  sx?: SxProps<Theme>
} & Pick<ComponentProps<typeof NextLink>, 'target'>

export const Link: FC<LinkProps> = ({children, href, disabled, target, variant, sx}) => {
  // https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
  return disabled ? (
    <Typography
      variant={variant ?? 'button3'}
      component="a"
      aria-disabled
      role="link"
      sx={{
        ...buttonCommonSx,
        ...buttonDisabledSx,
        ...sx,
      }}
    >
      {children}
    </Typography>
  ) : (
    <Typography
      variant={variant ?? 'button3'}
      component={NextLink}
      href={href ?? ''}
      target={target}
      sx={{
        ...buttonCommonSx,
        ...sx,
      }}
    >
      {children}
    </Typography>
  )
}

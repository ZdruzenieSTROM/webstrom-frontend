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
} & Pick<ComponentProps<typeof NextLink>, 'target' | 'prefetch'>

export const Link: FC<LinkProps> = ({
  children,
  href,
  disabled,
  target,
  variant,
  invertColors,
  active,
  sx,
  textSx,
  prefetch: overridePrefetch,
}) => {
  // https://nextjs.org/docs/pages/api-reference/components/link#prefetch
  // by default, next.js prefetchuje stranky vsetkych linkov vo viewporte. pre media PDFka je to zbytocne heavy.
  // inak aj pri `false` sa stale prefetchne pri hoveri, co je acceptable.
  const isMedia = href?.startsWith('/media')
  const defaultPrefetch = !isMedia
  const prefetch = overridePrefetch ?? defaultPrefetch

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
      prefetch={prefetch}
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

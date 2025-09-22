import {Box, SxProps, Theme, Typography, TypographyProps} from '@mui/material'
import NextLink from 'next/link'
import {ComponentProps, FC, ReactNode} from 'react'

import {useSeminarInfo} from '@/utils/useSeminarInfo'

import {buttonInnerSx, getButtonWrapperSx} from './buttonStyles'
import {isExternalLink} from './isExternalLink'

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
  prefetch,
}) => {
  const {seminar} = useSeminarInfo()

  const constructUrl = (url: string | undefined) => {
    // `url` z databazy z menu item
    // je vo formate `/poradie/` alebo `/akcie/matboj/`
    // kedy sa odkazuje na podstranku v ramci daneho seminara
    // alebo https://domain.com alebo www.domain.com
    // v pripade externeho linku kedy presmerujeme priamo na dany link.
    if (url === undefined) {
      return url
    }
    if (url.startsWith('http') || url.startsWith('www')) {
      return url
    }

    if (!url.startsWith('/')) {
      url = `/${url}`
    }

    return `/${seminar}${url}`
  }
  const url = constructUrl(href)
  const isExternal = isExternalLink(url)
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
      component={isExternal ? 'a' : NextLink}
      href={url ?? ''}
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

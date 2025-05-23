import {Box, SxProps, Theme, Typography} from '@mui/material'
import NextLink from 'next/link'
import {ComponentProps, FC, ReactNode} from 'react'

import {getDefaultLinkPrefetch} from './getDefaultLinkPrefetch'

type InlineLinkProps = {
  href?: string
  children: ReactNode
  sx?: SxProps<Theme>
  textSx?: SxProps<Theme>
} & Pick<ComponentProps<typeof NextLink>, 'target' | 'prefetch'>

export const InlineLink: FC<InlineLinkProps> = ({children, href, target, sx, textSx, prefetch: overridePrefetch}) => {
  const defaultPrefetch = getDefaultLinkPrefetch(href)
  const prefetch = overridePrefetch ?? defaultPrefetch

  return (
    <Box component={NextLink} href={href ?? ''} target={target} prefetch={prefetch} sx={sx}>
      <Typography variant="inlineLink" sx={textSx}>
        {children}
      </Typography>
    </Box>
  )
}

import {Box, SxProps, Theme, Typography} from '@mui/material'
import NextLink from 'next/link'
import {ComponentProps, FC, ReactNode} from 'react'

import {isExternalLink} from './isExternalLink'

type InlineLinkProps = {
  href?: string
  children: ReactNode
  sx?: SxProps<Theme>
  textSx?: SxProps<Theme>
} & Pick<ComponentProps<typeof NextLink>, 'target' | 'prefetch'>

export const InlineLink: FC<InlineLinkProps> = ({children, href, target, sx, textSx, prefetch}) => {
  const isExternal = isExternalLink(href)

  return (
    <Box component={isExternal ? 'a' : NextLink} href={href ?? ''} target={target} prefetch={prefetch} sx={sx}>
      <Typography variant="inlineLink" sx={textSx}>
        {children}
      </Typography>
    </Box>
  )
}

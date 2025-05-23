import {Box, Typography} from '@mui/material'
import {FC, JSX, ReactNode} from 'react'

import {colors} from '@/colors'

import {Link} from '../Clickable/Link'

type MarkdownLinkProps = {
  children: ReactNode[]
  href?: string
}

export const MarkdownLink: FC<MarkdownLinkProps> = ({children, href}) => (
  <Link variant="button2" href={href}>
    {children}
  </Link>
)

export const Table: FC<JSX.IntrinsicElements['table']> = ({children}) => (
  <Box component="table" sx={{textAlign: 'center'}}>
    {children}
  </Box>
)

export const Th: FC<JSX.IntrinsicElements['th']> = ({children}) => (
  <Box
    component="th"
    sx={{
      padding: '3px 1.5vw',
      bgcolor: colors.black,
      color: colors.white,
    }}
  >
    <Typography variant="h3" component="span">
      {children}
    </Typography>
  </Box>
)

export const Td: FC<JSX.IntrinsicElements['td']> = ({children}) => (
  <Typography variant="body1" component="td" p={0.3}>
    {children}
  </Typography>
)

export const Ol: FC<JSX.IntrinsicElements['ol']> = ({children}) => (
  <Typography variant="body1" component="ol">
    {children}
  </Typography>
)

export const Ul: FC<JSX.IntrinsicElements['ul']> = ({children}) => (
  <Typography variant="body1" component="ul">
    {children}
  </Typography>
)

export const P: FC<JSX.IntrinsicElements['p']> = ({children}) => (
  <Typography variant="body1" mt={1} component="div">
    {children}
  </Typography>
)

export const H1: FC<JSX.IntrinsicElements['h1']> = ({children}) => (
  <Typography variant="h1" mt={10} component="div">
    {children}
  </Typography>
)

export const H2: FC<JSX.IntrinsicElements['h2']> = ({children}) => (
  <Typography variant="h2" mt={5} component="div">
    {children}
  </Typography>
)

export const H3: FC<JSX.IntrinsicElements['h3']> = ({children}) => (
  <Typography variant="h3" mt={3} component="div">
    {children}
  </Typography>
)

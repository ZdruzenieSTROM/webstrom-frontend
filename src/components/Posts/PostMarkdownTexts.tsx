import {Typography} from '@mui/material'
import {FC, ReactNode} from 'react'
import {HeadingProps, OrderedListProps, ReactMarkdownProps, UnorderedListProps} from 'react-markdown/lib/ast-to-react'

import {Link} from '../Clickable/Link'

type MarkdownLinkProps = {
  children: ReactNode[]
  href?: string
}

export const MarkdownLink: FC<MarkdownLinkProps> = ({children, href}) => (
  <Link href={href}>
    <Typography variant="postBody">{children}</Typography>
  </Link>
)

export const Ol: FC<OrderedListProps> = ({children}) => (
  <Typography variant="postBody" component="ol">
    {children}
  </Typography>
)

export const Ul: FC<UnorderedListProps> = ({children}) => (
  <Typography variant="postBody" component="ul">
    {children}
  </Typography>
)

export const Paragraph: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="postBody" mt={0.5} component="div">
    {children}
  </Typography>
)

export const Header: FC<HeadingProps> = ({children}) => (
  <Typography variant="postBody" mt={1} component="div" fontWeight={800}>
    {children}
  </Typography>
)

import {Typography} from '@mui/material'
import {FC, JSX} from 'react'

import {InlineLink} from '../Clickable/InlineLink'

export const MarkdownLink: FC<JSX.IntrinsicElements['a']> = ({children, href}) => (
  <InlineLink href={href}>
    <Typography variant="postBody">{children}</Typography>
  </InlineLink>
)

export const Ol: FC<JSX.IntrinsicElements['ol']> = ({children}) => (
  <Typography variant="postBody" component="ol">
    {children}
  </Typography>
)

export const Ul: FC<JSX.IntrinsicElements['ul']> = ({children}) => (
  <Typography variant="postBody" component="ul">
    {children}
  </Typography>
)

export const Paragraph: FC<JSX.IntrinsicElements['p']> = ({children}) => (
  <Typography variant="postBody" mt={0.5} component="div">
    {children}
  </Typography>
)

export const Header: FC<JSX.IntrinsicElements['h1']> = ({children}) => (
  <Typography variant="postBody" mt={1} component="div" fontWeight={800}>
    {children}
  </Typography>
)

import {Typography} from '@mui/material'
import {FC, ReactNode} from 'react'
import {
  HeadingProps,
  OrderedListProps,
  ReactMarkdownProps,
  TableDataCellProps,
  TableHeaderCellProps,
  UnorderedListProps,
} from 'react-markdown/lib/ast-to-react'

import {Link} from '../Clickable/Link'
import styles from './Texts.module.scss'

type MarkdownLinkProps = {
  children: ReactNode[]
  href?: string
}

export const MarkdownLink: FC<MarkdownLinkProps> = ({children, href}) => (
  <Link variant="button2" href={href}>
    {children}
  </Link>
)

export const Table: FC<ReactMarkdownProps> = ({children}) => <table className={styles.table}>{children}</table>

export const Th: FC<TableHeaderCellProps> = ({children}) => (
  <th className={styles.th}>
    <Typography variant="h3" component="span">
      {children}
    </Typography>
  </th>
)

export const Td: FC<TableDataCellProps> = ({children}) => (
  <Typography variant="body1" component="td" p={0.3}>
    {children}
  </Typography>
)

export const Ol: FC<OrderedListProps> = ({children}) => (
  <Typography variant="body1" component="ol">
    {children}
  </Typography>
)

export const Ul: FC<UnorderedListProps> = ({children}) => (
  <Typography variant="body1" component="ul">
    {children}
  </Typography>
)

export const P: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="body1" mt={1} component="div">
    {children}
  </Typography>
)

export const H1: FC<HeadingProps> = ({children}) => (
  <Typography variant="h1" mt={10} component="div">
    {children}
  </Typography>
)

export const H2: FC<HeadingProps> = ({children}) => (
  <Typography variant="h2" mt={5} component="div">
    {children}
  </Typography>
)

export const H3: FC<HeadingProps> = ({children}) => (
  <Typography variant="h3" mt={3} component="div">
    {children}
  </Typography>
)

import {Typography} from '@mui/material'
import {FC, ReactNode} from 'react'
import {ReactMarkdownProps, TableDataCellProps, TableHeaderCellProps} from 'react-markdown/lib/ast-to-react'

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
export const Th: FC<TableHeaderCellProps> = ({children}) => <th className={styles.th}>{children}</th>
export const Td: FC<TableDataCellProps> = ({children}) => <td className={styles.td}>{children}</td>
export const Table: FC<ReactMarkdownProps> = ({children}) => <table className={styles.table}>{children}</table>
export const P: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="body1" sx={{marginTop: 1}} component="div">
    {children}
  </Typography>
)
export const H1: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="h1" sx={{marginTop: 10}}>
    {children}
  </Typography>
)
export const H2: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="h2" sx={{marginTop: 5}}>
    {children}
  </Typography>
)
export const H3: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="h3" sx={{marginTop: 3}}>
    {children}
  </Typography>
)
export const Ul: FC<ReactMarkdownProps> = ({children}) => (
  <Typography variant="body1" sx={{marginTop: 1}}>
    {children}
  </Typography>
)

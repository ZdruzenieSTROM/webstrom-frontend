import {FC, ReactNode} from 'react'
import {ReactMarkdownProps, TableDataCellProps, TableHeaderCellProps} from 'react-markdown/lib/ast-to-react'

import {Link} from '../Clickable/Clickable'
import styles from './Texts.module.scss'

type MarkdownLinkProps = {
  children: ReactNode[]
  href?: string
}

export const MarkdownLink: FC<MarkdownLinkProps> = ({children, href}) => <Link href={href}>{children}</Link>
export const Th: FC<TableHeaderCellProps> = ({children}) => <th className={styles.th}>{children}</th>
export const Td: FC<TableDataCellProps> = ({children}) => <td className={styles.td}>{children}</td>
export const Table: FC<ReactMarkdownProps> = ({children}) => <table className={styles.table}>{children}</table>
export const P: FC<ReactMarkdownProps> = ({children}) => <p className={styles.p}>{children}</p>

import {FC} from 'react'
import {ReactMarkdownProps, TableDataCellProps, TableHeaderCellProps} from 'react-markdown/lib/ast-to-react'

import styles from './Texts.module.scss'

export const Th: FC<TableHeaderCellProps> = ({children}) => <th className={styles.th}>{children}</th>
export const Td: FC<TableDataCellProps> = ({children}) => <td className={styles.td}>{children}</td>
export const Table: FC<ReactMarkdownProps> = ({children}) => <table className={styles.table}>{children}</table>

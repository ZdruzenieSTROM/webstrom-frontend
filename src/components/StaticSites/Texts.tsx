import {FC} from 'react'
import {HeadingProps} from 'react-markdown/lib/ast-to-react'

import styles from './Texts.module.scss'

export const H1: FC<HeadingProps> = ({children}) => <h1 className={styles.h1}>{children}</h1>
export const H2: FC<HeadingProps> = ({children}) => <h2>{children}</h2>
export const H3: FC<HeadingProps> = ({children}) => <h3>{children}</h3>
export const H4: FC<HeadingProps> = ({children}) => <h4>{children}</h4>
export const H5: FC<HeadingProps> = ({children}) => <h5>{children}</h5>
export const H6: FC<HeadingProps> = ({children}) => <h6>{children}</h6>

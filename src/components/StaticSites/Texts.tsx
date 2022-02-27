import {FC} from 'react'

import styles from './Texts.module.css'

export const H1: FC = ({children}) => <h1 className={styles.h1}>{children}</h1>
export const H2: FC = ({children}) => <h2 className={styles.h2}>{children}</h2>
export const H3: FC = ({children}) => <h3 className={styles.h3}>{children}</h3>
export const H4: FC = ({children}) => <h4 className={styles.h4}>{children}</h4>
export const H5: FC = ({children}) => <h5 className={styles.h5}>{children}</h5>
export const H6: FC = ({children}) => <h6 className={styles.h6}>{children}</h6>

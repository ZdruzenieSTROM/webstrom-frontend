import {FC} from 'react'

import styles from './PagePlaceholder.module.scss'

export const PagePlaceholder: FC<{title: string}> = ({title}) => {
  return (
    <div className={styles.placeholder}>
      <h1>{title}</h1>
    </div>
  )
}

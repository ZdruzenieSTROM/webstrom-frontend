import {FC, MouseEvent} from 'react'

import styles from './StromLogo.module.scss'

const handleClick = (e: MouseEvent<HTMLElement>) => {
  console.log('Clicked')
}

export const StromLogo: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tree} onClick={handleClick} />
    </div>
  )
}

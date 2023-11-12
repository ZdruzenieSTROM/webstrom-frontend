import Image from 'next/image'
import {FC} from 'react'

import styles from './Logo.module.scss'

export interface ILogo {
  id: number
  name: string
  disabled: string
  image: string
}

export const Logo: FC<ILogo> = ({id, name, disabled, image}) => {
  return (
    <div className={styles.imageContainer}>
      {disabled || (
        <Image
          src={image}
          alt={name} // TODO: alt from backend
          className={styles.image}
          width={800} // These values are overwritten by css
          height={800}
        />
      )}
    </div>
  )
}

import {FC} from 'react'
import {useCookies} from 'react-cookie'

import styles from './Footer.module.scss'

export const Footer: FC = () => {
  const [cookies] = useCookies(['webstrom-token', 'webstrom-name'])

  return (
    <div className={styles.footer}>
      <div>
        {/* webstrom-name a webstrom-token sa v budúcnosti nebudú vypisovať. Zatiaľ tu sú na debugovanie. */}
        <span> webstrom-name: {cookies['webstrom-name']} </span>
        <span> webstrom-token: {cookies['webstrom-token']} </span>
      </div>
    </div>
  )
}

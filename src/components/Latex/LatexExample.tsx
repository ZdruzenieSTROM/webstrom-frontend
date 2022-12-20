import {ChangeEvent, FC, useState} from 'react'

import {Link} from '../Clickable/Clickable'
import {Latex} from './Latex'
import styles from './LatexExample.module.scss'

export const LatexExample: FC = () => {
  const [tex, setTex] = useState('')
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTex(event.target.value)
  }

  return (
    <div className={styles.latexExampleContainer}>
      <div>
        <Link href="/test">{'< Back to examples'}</Link>
      </div>
      <textarea value={tex} onChange={handleInputChange} />
      <Latex>{tex}</Latex>
    </div>
  )
}

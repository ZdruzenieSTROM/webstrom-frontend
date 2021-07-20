// import './LatexExample.css'
import {ChangeEvent, FC, useState} from 'react'

import {Latex} from './Latex'

export const LatexExample: FC = () => {
  const [tex, setTex] = useState('')
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTex(event.target.value)
  }

  return (
    <div className="latex-example-container">
      <textarea value={tex} onChange={handleInputChange} />
      <Latex>{tex}</Latex>
    </div>
  )
}

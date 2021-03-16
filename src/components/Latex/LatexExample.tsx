import './LatexExample.css'

import React, {useState} from 'react'

import {Latex} from './Latex'

export const LatexExample: React.FC = () => {
  const [tex, setTex] = useState('')

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTex(event.target.value)
  }

  return (
    <div className="latex-example-container">
      <textarea value={tex} onChange={handleInputChange} />
      <Latex>{tex}</Latex>
    </div>
  )
}

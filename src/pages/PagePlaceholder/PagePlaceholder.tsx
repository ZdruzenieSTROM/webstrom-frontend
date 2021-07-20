// import './PagePlaceholder.css'
import React from 'react'

export const PagePlaceholder: React.FC<{title: string}> = ({title}) => {
  return (
    <div className="placeholder">
      <h1>{title}</h1>
    </div>
  )
}

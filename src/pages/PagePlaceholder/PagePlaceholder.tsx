import React from 'react'
import './PagePlaceholder.css'

export const PagePlaceholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="placeholder">
      <h1>{title}</h1>
    </div>
  )
}

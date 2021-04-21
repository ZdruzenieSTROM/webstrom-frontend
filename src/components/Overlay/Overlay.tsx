import './Overlay.scss'

import React from 'react'

interface IOverlay {
  children: React.ReactNode
  display: boolean
  displayToggle: () => void
}

export const Overlay: React.FC<IOverlay> = ({children, display, displayToggle}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Po kliknutí na overlay, mimo akýchkoľvek iných elementov, sa overlay zatvorí.
    if ((e.target as Element).classList.contains('overlay')) {
      displayToggle()
    }
  }

  return (
    <div className={'overlay ' + (display && 'display ')} onClick={handleClick}>
      {children}
    </div>
  )
}

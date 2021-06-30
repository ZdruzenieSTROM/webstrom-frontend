// import './Overlay.scss'
import {FC, MouseEvent} from 'react'

interface IOverlay {
  display: boolean
  closeOverlay: () => void
}

export const Overlay: FC<IOverlay> = ({children, display, closeOverlay}) => {
  const handleClick = (e: MouseEvent) => {
    // Po kliknutí na overlay, mimo akýchkoľvek iných elementov, sa overlay zatvorí.
    if ((e.target as Element).classList.contains('overlay')) {
      closeOverlay()
    }
  }

  return display ? (
    <div className="overlay" onClick={handleClick}>
      {children}
    </div>
  ) : null
}

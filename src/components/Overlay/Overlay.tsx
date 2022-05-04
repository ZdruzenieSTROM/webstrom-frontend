import {FC, MouseEvent} from 'react'

import styles from './Overlay.module.scss'

interface OverlayProps {
  display: boolean
  closeOverlay: () => void
}

export const Overlay: FC<OverlayProps> = ({children, display, closeOverlay}) => {
  const handleClick = (e: MouseEvent) => {
    // Po kliknutí na overlay, mimo akýchkoľvek iných elementov, sa overlay zatvorí.
    if ((e.target as Element).classList.contains(styles.overlay)) {
      closeOverlay()
    }
  }

  return display ? (
    <div className={styles.overlay} onClick={handleClick}>
      {children}
    </div>
  ) : null
}

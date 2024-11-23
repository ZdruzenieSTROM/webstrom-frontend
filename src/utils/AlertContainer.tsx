import {useState} from 'react'
import {createContainer} from 'unstated-next'

export interface AlertProps {
  isOpen: boolean
  title?: string
  message?: string
}

const useAlertBox = () => {
  const [alertBox, setAlertBox] = useState<AlertProps>()
  return {alertBox, setAlertBox}
}

export const AlertContainer = createContainer(useAlertBox)

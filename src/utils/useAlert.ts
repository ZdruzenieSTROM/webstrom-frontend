import {useCallback} from 'react'
import {useContainer} from 'unstated-next'

import {AlertContainer} from '@/utils/AlertContainer'

export const useAlert = () => {
  const {setAlertBox} = useContainer(AlertContainer)

  const alert = useCallback(
    (message: string, options?: {title?: string; onCloseCallback?: () => void}) => {
      setAlertBox({
        message: message,
        title: options?.title ?? 'Upozornenie',
        isOpen: true,
        onCloseCallback: options?.onCloseCallback,
      })
    },
    [setAlertBox],
  )

  return {alert}
}

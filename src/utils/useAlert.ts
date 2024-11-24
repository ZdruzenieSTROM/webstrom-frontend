import {useContainer} from 'unstated-next'

import {AlertContainer} from '@/utils/AlertContainer'

export const useAlert = () => {
  const container = useContainer(AlertContainer)

  const alert = (message: string, options?: {title?: string; onCloseCallback?: () => void}) => {
    container.setAlertBox({
      message: message,
      title: options?.title ?? 'Upozornenie',
      isOpen: true,
      onCloseCallback: options?.onCloseCallback,
    })
  }

  return {alert}
}

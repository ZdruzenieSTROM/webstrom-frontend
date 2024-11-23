import {useContainer} from 'unstated-next'

import {AlertContainer} from '@/utils/AlertContainer'

export const useAlert = () => {
  const container = useContainer(AlertContainer)

  const alert = (message: string, title?: string) => {
    container.setAlertBox({message: message, title: title ?? 'Upozornenie', isOpen: true})
  }

  return {alert}
}

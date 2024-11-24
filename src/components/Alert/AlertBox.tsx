import {Stack} from '@mui/material'
import {FC} from 'react'
import {useContainer} from 'unstated-next'

import {AlertContainer} from '@/utils/AlertContainer'

import {Button} from '../Clickable/Button'
import {Dialog} from '../Dialog/Dialog'

export const AlertBox: FC = () => {
  const container = useContainer(AlertContainer)

  const closeContainer = () => {
    container.setAlertBox({
      message: container.alertBox?.message ?? '',
      title: container.alertBox?.title ?? '',
      isOpen: false,
    })
    if (container.alertBox?.onCloseCallback) container.alertBox.onCloseCallback()
  }

  return (
    <Dialog
      open={container.alertBox?.isOpen ?? false}
      title={container.alertBox?.title}
      contentText={container.alertBox?.message}
      close={closeContainer}
    >
      <Stack direction={'row'} mt={3} justifyContent="center">
        <Button variant="button1" onClick={closeContainer}>
          Dobre
        </Button>
      </Stack>
    </Dialog>
  )
}

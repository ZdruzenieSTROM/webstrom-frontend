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
  }

  return (
    <Dialog
      open={container.alertBox?.isOpen ?? false}
      title={container.alertBox?.title}
      contentText={container.alertBox?.message}
      close={closeContainer}
    >
      <Stack direction={'row'} mt={3} justifyContent="end">
        <Button variant="button2" onClick={closeContainer}>
          Potvrdiť
        </Button>
      </Stack>
    </Dialog>
  )
}

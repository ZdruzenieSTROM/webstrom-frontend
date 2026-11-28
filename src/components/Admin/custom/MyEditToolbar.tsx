import {Stack} from '@mui/material'
import {DeleteButton, SaveButton, Toolbar, useNotify} from 'react-admin'

export const MyEditToolbar = ({disableSave}: {disableSave?: boolean} = {}) => {
  const notify = useNotify()
  return (
    <Toolbar sx={{justifyContent: 'space-between'}}>
      <Stack direction="row" gap={1}>
        <SaveButton disabled={disableSave} />
        <SaveButton
          disabled={disableSave}
          label="ra.action.save_and_stay"
          mutationOptions={{
            onSuccess: () => {
              notify('content.notifications.record_saved')
            },
          }}
          type="button"
        />
      </Stack>
      <DeleteButton />
    </Toolbar>
  )
}

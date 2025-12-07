import {Stack} from '@mui/material'
import {DeleteButton, SaveButton, Toolbar, useNotify} from 'react-admin'

export const MyEditToolbar = () => {
  const notify = useNotify()
  return (
    <Toolbar sx={{justifyContent: 'space-between'}}>
      <Stack direction="row" spacing={1}>
        <SaveButton />
        <SaveButton
          label="ra.action.save_and_stay"
          mutationOptions={{
            onSuccess: () => {
              notify('Záznam uložený')
            },
          }}
          type="button"
        />
      </Stack>
      <DeleteButton />
    </Toolbar>
  )
}

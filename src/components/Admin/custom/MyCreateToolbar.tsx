import {SaveButton, Toolbar, useNotify} from 'react-admin'
import {useFormContext} from 'react-hook-form'

export const MyCreateToolbar = () => {
  const {reset} = useFormContext()
  const notify = useNotify()
  return (
    <Toolbar sx={{gap: 1}}>
      <SaveButton />
      <SaveButton
        label="ra.action.save_and_create_another"
        mutationOptions={{
          onSuccess: () => {
            notify('Záznam vytvorený')
            // TODO: customizovat - niektore fieldy nechame predvyplnene
            reset()
          },
        }}
        type="button"
      />
    </Toolbar>
  )
}

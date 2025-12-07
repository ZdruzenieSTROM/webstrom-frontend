import {SaveButton, Toolbar, useNotify} from 'react-admin'
import {useFormContext} from 'react-hook-form'

export const MyToolbar = () => {
  const {reset} = useFormContext()
  const notify = useNotify()
  return (
    <Toolbar>
      <SaveButton label="Uložiť" />
      <SaveButton
        label="Uložiť a vytvoriť ďalší"
        mutationOptions={{
          onSuccess: () => {
            notify('Záznam vytvorený')
            reset()
          },
        }}
        type="button"
        variant="text"
      />
    </Toolbar>
  )
}

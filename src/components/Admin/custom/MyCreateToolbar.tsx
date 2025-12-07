import {SaveButton, Toolbar, useNotify} from 'react-admin'
import {useFormContext} from 'react-hook-form'

interface MyCreateToolbarProps {
  dontResetFields?: string[]
}

export const MyCreateToolbar = ({dontResetFields}: MyCreateToolbarProps = {}) => {
  const {reset, getValues} = useFormContext()
  const notify = useNotify()
  return (
    <Toolbar sx={{gap: 1}}>
      <SaveButton />
      <SaveButton
        label="ra.action.save_and_create_another"
        mutationOptions={{
          onSuccess: () => {
            notify('Záznam vytvorený')
            if (dontResetFields) {
              const currentValues = getValues()
              const preservedValues: Record<string, unknown> = {}
              for (const field of dontResetFields) {
                preservedValues[field] = currentValues[field]
              }
              reset(preservedValues)
            } else {
              reset()
            }
          },
        }}
        type="button"
      />
    </Toolbar>
  )
}

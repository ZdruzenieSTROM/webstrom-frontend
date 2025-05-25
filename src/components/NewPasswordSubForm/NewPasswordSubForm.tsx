import {Visibility, VisibilityOff} from '@mui/icons-material'
import {IconButton, Stack} from '@mui/material'
import {useState} from 'react'
import {Control, UseFormGetValues, UseFormSetValue, UseFormWatch} from 'react-hook-form'

import {FormInput} from '../FormItems/FormInput/FormInput'

export type NewPasswordSubFormValues = {
  password1?: string
  password2?: string
}

type NewPasswordSubFormProps<T extends NewPasswordSubFormValues> = {
  control: Control<T, unknown>
  watch?: UseFormWatch<T>
  setValue?: UseFormSetValue<T>
  getValues: UseFormGetValues<T>
  gap: number
}

export const NewPasswordSubForm = ({control, gap, getValues}: NewPasswordSubFormProps<NewPasswordSubFormValues>) => {
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const requiredRule = {required: '* Toto pole nemôže byť prázdne.'}

  return (
    <Stack gap={gap}>
      <FormInput
        control={control}
        name={'password1'}
        label="heslo*"
        type={showPassword1 ? 'text' : 'password'}
        autoComplete="new-password"
        rules={{
          ...requiredRule,
          minLength: {
            value: 8,
            message: '* Toto heslo je príliš krátke. Musí obsahovať aspoň 8 znakov.',
          },
        }}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setShowPassword1(!showPassword1)}>
              {showPassword1 ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      <FormInput
        control={control}
        name={'password2'}
        label="potvrdenie hesla*"
        type={showPassword2 ? 'text' : 'password'}
        autoComplete="new-password"
        rules={{
          ...requiredRule,
          validate: (val) => {
            if (val !== getValues().password1) return '* Zadané heslá sa nezhodujú.'
          },
        }}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setShowPassword2(!showPassword2)}>
              {showPassword2 ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
    </Stack>
  )
}

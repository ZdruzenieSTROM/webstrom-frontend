import {FormControl, Input, InputLabel, InputProps} from '@material-ui/core'
import React, {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

const FormInput: FC<InputProps & {name: string; control: Control; label: string; errors?: any}> = (props) => {
  const {control, name, label, required, errors} = props

  return (
    <>
      <FormControl fullWidth={true}>
        <InputLabel htmlFor={name} shrink required={!!required}>
          {label}
        </InputLabel>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          as={<Input id={name} {...props} error={!!errors} />}
        />
      </FormControl>
      {errors && <p>{errors && errors?.message}</p>}
    </>
  )
}

export default FormInput

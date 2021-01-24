import {FormControl, Input, InputLabel, InputProps} from '@material-ui/core'
import React, {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

const FormInput: FC<InputProps & {name: string; control: Control; label: string}> = (props) => {
  const {control, name, label, required} = props

  return (
    <FormControl fullWidth={true}>
      <InputLabel htmlFor={name} required={!!required}>
        {label}
      </InputLabel>
      <Controller name={name} control={control} defaultValue="" as={<Input id={name} {...props} />} />
    </FormControl>
  )
}

export default FormInput

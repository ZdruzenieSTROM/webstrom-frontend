import TextField from '@material-ui/core/TextField'
import React from 'react'
import {Controller, useFormContext} from 'react-hook-form'

const FormInput = (props: any) => {
  const {control} = useFormContext()
  const {name, label, required, isError, errorMessage} = props

  return (
    <Controller
      as={TextField}
      name={name}
      control={control}
      defaultValue=""
      label={label}
      fullWidth={true}
      InputLabelProps={{
        className: required ? 'required-label' : '',
        required: required || false,
      }}
      error={isError}
      helperText={errorMessage}
      {...props}
    />
  )
}

export default FormInput

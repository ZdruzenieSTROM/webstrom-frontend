import {FormControl, Input, InputLabel, InputProps} from '@material-ui/core'
import React, {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

export const FormInput: FC<InputProps & {name: string; control: Control; label: string}> = ({control, name, label}) => (
  <>
    <FormControl fullWidth={true}>
      <InputLabel htmlFor={name} shrink>
        {label}
      </InputLabel>
      <Controller name={name} control={control} defaultValue="" as={<Input id={name} />} />
    </FormControl>
  </>
)

import {FormControl, InputLabel, MenuItem, Select, SelectProps} from '@material-ui/core'
import React, {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

export type SelectItem = {id: number; label: string}

export const FormSelect: FC<SelectProps & {name: string; control: Control; options: SelectItem[]}> = (props) => {
  const {label, name, options, control} = props
  return (
    <FormControl fullWidth={true}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        as={
          <Select id={name} {...props}>
            {options.map(({id, label}) => (
              <MenuItem key={id} value={id}>
                {label}
              </MenuItem>
            ))}
          </Select>
        }
      />
    </FormControl>
  )
}

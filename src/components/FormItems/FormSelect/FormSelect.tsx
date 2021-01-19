import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core'
import React from 'react'
import {Controller} from 'react-hook-form'

const MuiSelect = (props: any) => {
  const {label, name, options} = props
  return (
    <FormControl fullWidth={true}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select id={name} {...props}>
        {options &&
          options.map((item: {id: string; label: string}) => (
            <MenuItem key={item.id} value={item.id}>
              {item.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

const FormSelect = (props: any) => {
  const {control, name, label, options} = props
  return (
    <React.Fragment>
      <Controller
        name={name}
        control={control}
        render={({ref, ...props}) => <MuiSelect options={options} label={label} {...props} />}
      />
    </React.Fragment>
  )
}

export default FormSelect

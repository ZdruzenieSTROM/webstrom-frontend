import {Checkbox, CheckboxProps, FormControlLabel} from '@material-ui/core'
import React, {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

export const FormCheckbox: FC<CheckboxProps & {name: string; control: Control; label: string}> = ({
  control,
  name,
  label,
  disabled,
}) => (
  <Controller
    name={name}
    control={control}
    render={({onChange, value}) => (
      <FormControlLabel
        control={<Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />}
        label={label}
        disabled={disabled}
      />
    )}
  />
)

import {Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText} from '@mui/material'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

import {formItemStyle} from '../styles'

export const FormCheckbox: FC<
  CheckboxProps &
    Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {label: string; fieldError?: FieldError}
> = ({control, name, label, disabled, rules, fieldError}) => (
  <FormControl fullWidth={true} sx={formItemStyle}>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({onChange, value}) => (
        <FormControlLabel
          control={<Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />}
          label={label}
          disabled={disabled}
        />
      )}
    />
    <FormHelperText>{fieldError?.message}</FormHelperText>
  </FormControl>
)

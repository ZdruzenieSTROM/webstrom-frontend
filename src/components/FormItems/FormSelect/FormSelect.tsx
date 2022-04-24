import {MenuItem, TextField, TextFieldProps} from '@mui/material'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

import {formItemStyle} from '../styles'

export type SelectOption = {id: number; label: string}

export const FormSelect: FC<
  TextFieldProps &
    Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {
      options: SelectOption[]
      disabled?: boolean
      fieldError?: FieldError
    }
> = ({label, name, options, control, disabled, rules, fieldError}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={(props) => (
      <TextField
        {...props}
        id={name}
        disabled={disabled}
        select
        variant="outlined"
        label={label}
        fullWidth
        helperText={fieldError?.message}
        focused={false}
        sx={formItemStyle}
      >
        {options.map(({id, label}) => (
          <MenuItem key={id} value={id}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
)

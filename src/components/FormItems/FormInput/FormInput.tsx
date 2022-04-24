import {TextField, TextFieldProps} from '@mui/material'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

import {formItemStyle} from '../styles'

export const FormInput: FC<
  TextFieldProps &
    Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {label: string; fieldError?: FieldError}
> = ({control, name, label, type, rules, fieldError}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={(props) => (
      <TextField
        {...props}
        id={name}
        label={label}
        type={type}
        variant="outlined"
        fullWidth
        helperText={fieldError?.message}
        focused={false}
        sx={formItemStyle}
      />
    )}
  />
)

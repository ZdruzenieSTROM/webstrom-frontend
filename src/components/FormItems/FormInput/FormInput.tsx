import {TextField, TextFieldProps} from '@mui/material'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

import {formItemStyle} from '../styles'

export const FormInput: FC<
  TextFieldProps &
    Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {label: string; fieldError?: FieldError}
> = ({control, name, label, rules, fieldError}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    defaultValue=""
    as={
      <TextField
        id={name}
        label={label}
        variant="outlined"
        fullWidth={true}
        helperText={fieldError?.message}
        focused={false}
        sx={formItemStyle}
      />
    }
  />
)

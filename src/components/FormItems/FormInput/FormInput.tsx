import {TextField, TextFieldProps} from '@mui/material'
import {Controller, ControllerProps, FieldError, FieldPath, FieldValues} from 'react-hook-form'

import {formItemStyle} from '../styles'

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  type,
  rules,
  fieldError,
}: TextFieldProps &
  Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> & {
    label: string
    fieldError?: FieldError
  }) => (
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

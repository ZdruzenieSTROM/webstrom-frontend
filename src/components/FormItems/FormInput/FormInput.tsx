import {TextField, TextFieldProps} from '@mui/material'
import {Controller, ControllerProps, FieldPath, FieldValues} from 'react-hook-form'

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
}: TextFieldProps &
  Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> & {
    label: string
  }) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({field, fieldState: {error}}) => (
      <TextField
        {...field}
        id={name}
        label={label}
        type={type}
        variant="outlined"
        fullWidth
        helperText={error?.message}
        focused={false}
        sx={formItemStyle}
      />
    )}
  />
)

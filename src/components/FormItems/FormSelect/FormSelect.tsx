import {MenuItem, TextField, TextFieldProps} from '@mui/material'
import {Controller, ControllerProps, FieldPath, FieldValues} from 'react-hook-form'

import {formItemStyle} from '../styles'

export type SelectOption = {id: number; label: string}

export const FormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  name,
  options,
  control,
  disabled,
  rules,
}: TextFieldProps &
  Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> & {
    options: SelectOption[]
    disabled?: boolean
  }) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({field, fieldState: {error}}) => (
      <TextField
        {...field}
        id={name}
        disabled={disabled}
        select
        variant="outlined"
        label={label}
        fullWidth
        helperText={error?.message}
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

import {Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText} from '@mui/material'
import {Controller, ControllerProps, FieldError, FieldPath, FieldValues} from 'react-hook-form'

import {formItemStyle} from '../styles'

export const FormCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  disabled,
  rules,
  fieldError,
}: CheckboxProps &
  Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> & {
    label: string
    fieldError?: FieldError
  }) => (
  <FormControl fullWidth sx={formItemStyle}>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({field: {onChange, value}}) => (
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

import {Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText} from '@mui/material'
import {Controller, ControllerProps, FieldPath, FieldValues} from 'react-hook-form'

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
}: CheckboxProps &
  Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> & {
    label: string
  }) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({field: {onChange, value}, fieldState: {error}}) => (
      <FormControl fullWidth sx={formItemStyle}>
        <FormControlLabel
          control={<Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />}
          label={label}
          disabled={disabled}
        />
        <FormHelperText>{error?.message}</FormHelperText>
      </FormControl>
    )}
  />
)

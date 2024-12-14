import {Checkbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText, Typography} from '@mui/material'
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
        {error && (
          <FormHelperText>
            <Typography variant="body2" fontWeight={800}>
              {error.message}
            </Typography>
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
)

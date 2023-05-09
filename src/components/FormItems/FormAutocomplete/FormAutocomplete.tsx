import {Autocomplete, TextField, TextFieldProps} from '@mui/material'
import {Controller, ControllerProps, FieldPath, FieldValues} from 'react-hook-form'

import {SelectOption} from '../FormSelect/FormSelect'
import {formItemStyle} from '../styles'

export const FormAutocomplete = <
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
  <>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({field: {value, ...props}, fieldState: {error}}) => (
        <Autocomplete
          {...props}
          id={name}
          options={options}
          value={value || null}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          disabled={disabled}
          sx={formItemStyle}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'disabled',
              }}
              label={label}
              variant="outlined"
              fullWidth
              helperText={error?.message}
              focused={false}
            />
          )}
          onChange={(_event, value) => {
            props.onChange(value)
          }}
        />
      )}
    />
  </>
)

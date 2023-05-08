import {Autocomplete, TextField, TextFieldProps} from '@mui/material'
import {Controller, ControllerProps, FieldError, FieldErrorsImpl, FieldPath, FieldValues, Merge} from 'react-hook-form'

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
  fieldError,
}: TextFieldProps &
  Pick<ControllerProps<TFieldValues, TName>, 'name' | 'control' | 'rules'> & {
    options: SelectOption[]
    disabled?: boolean
    fieldError?:
      | Merge<
          FieldError,
          FieldErrorsImpl<{
            id: number
            label: string
          }>
        >
      | undefined
  }) => (
  <>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({field: {value, ...props}}) => (
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
              helperText={fieldError?.message}
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

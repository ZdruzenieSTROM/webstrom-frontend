import {Autocomplete, TextField, TextFieldProps} from '@mui/material'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

import {SelectOption} from '../FormSelect/FormSelect'
import {formItemStyle} from '../styles'

export const FormAutocomplete: FC<
  TextFieldProps &
    Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {
      options: SelectOption[]
      disabled?: boolean
      fieldError?: FieldError
    }
> = ({label, name, options, control, disabled, rules, fieldError}) => (
  <>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({value, ...props}) => (
        <Autocomplete
          {...props}
          id={name}
          options={options}
          value={value || null}
          getOptionLabel={(option) => option.label}
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

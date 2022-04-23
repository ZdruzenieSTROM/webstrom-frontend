import {FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectProps} from '@material-ui/core'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

export type SelectOption = {id: number; label: string}

export const FormSelect: FC<
  SelectProps &
    Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {
      options: SelectOption[]
      disabled?: boolean
      fieldError?: FieldError
    }
> = ({label, name, options, control, disabled, rules, fieldError}) => (
  <FormControl fullWidth={true} error={!!fieldError}>
    <InputLabel htmlFor={name} shrink>
      {label}
    </InputLabel>
    <Controller
      name={name}
      control={control}
      rules={rules}
      as={
        <Select id={name} disabled={disabled}>
          {options.map(({id, label}) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
      }
    />
    <FormHelperText>{fieldError?.message}</FormHelperText>
  </FormControl>
)

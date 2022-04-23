import {FormControl, FormHelperText, Input, InputLabel, InputProps} from '@material-ui/core'
import {FC} from 'react'
import {Controller, ControllerProps, FieldError} from 'react-hook-form'

export const FormInput: FC<
  InputProps & Pick<ControllerProps<'input'>, 'name' | 'control' | 'rules'> & {label: string; fieldError?: FieldError}
> = ({control, name, label, rules, fieldError}) => (
  <FormControl fullWidth={true} error={!!fieldError}>
    <InputLabel htmlFor={name} shrink>
      {label}
    </InputLabel>
    <Controller name={name} control={control} rules={rules} defaultValue="" as={<Input type="text" id={name} />} />
    <FormHelperText>{fieldError?.message}</FormHelperText>
  </FormControl>
)

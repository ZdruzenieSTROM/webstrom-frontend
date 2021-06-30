import {FormControl, InputLabel, MenuItem, Select, SelectProps} from '@material-ui/core'
import {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

export type SelectOption = {id: number; label: string}

export const FormSelect: FC<
  SelectProps & {name: string; control: Control; options: SelectOption[]; disabled?: boolean}
> = ({label, name, options, control, disabled}) => (
  <FormControl fullWidth={true}>
    <InputLabel htmlFor={name} shrink>
      {label}
    </InputLabel>
    <Controller
      name={name}
      control={control}
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
  </FormControl>
)

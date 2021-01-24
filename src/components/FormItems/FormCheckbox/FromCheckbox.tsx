import {Checkbox, CheckboxProps, FormControlLabel} from '@material-ui/core'
import React, {FC} from 'react'
import {Control, Controller} from 'react-hook-form'

const FormCheckbox: FC<CheckboxProps & {name: string; control: Control; label: string}> = (props) => {
  const {control, name, label} = props
  return (
    <Controller
      name={name}
      control={control}
      render={(controlProps) => (
        <FormControlLabel
          control={<Checkbox onChange={(e) => controlProps.onChange(e.target.checked)} checked={controlProps.value} />}
          label={label}
          disabled={props.disabled}
        />
      )}
    />
  )
}

export default FormCheckbox

import {Checkbox, FormControlLabel} from '@material-ui/core'
import React from 'react'
import {Controller} from 'react-hook-form'

const FormCheckbox = (props: any) => {
  const {control, name, label} = props
  return (
    <React.Fragment>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={(props) => (
          <FormControlLabel
            control={<Checkbox onChange={(e) => props.onChange(e.target.checked)} checked={props.value} />}
            label={label}
          />
        )}
      />
    </React.Fragment>
  )
}

export default FormCheckbox

import {CheckboxGroupInput, required} from 'react-admin'

export const SitesCheckboxInput: typeof CheckboxGroupInput = (props) => (
  <CheckboxGroupInput
    choices={[
      {id: 1, name: 'Strom'},
      {id: 2, name: 'Matik'},
      {id: 3, name: 'Malynar'},
      {id: 4, name: 'Zdruzenie'},
    ]}
    validate={required()}
    {...props}
  />
)

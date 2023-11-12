import {CheckboxGroupInput} from 'react-admin'

import {seminarIdToName} from '@/utils/useSeminarInfo'

const choices = Object.entries(seminarIdToName).map(([id, name]) => ({id, name}))

export const SitesCheckboxInput: typeof CheckboxGroupInput = (props) => (
  <CheckboxGroupInput choices={choices} {...props} />
)

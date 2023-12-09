import {FC} from 'react'
import {NumberInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const FlatpageCreate: FC = () => (
  <MyCreate>
    <SimpleForm>
      <NumberInput source="id" fullWidth disabled />
      <TextInput source="url" fullWidth validate={required()} />
      <TextInput source="title" fullWidth validate={required()} />
      <TextInput source="content" multiline fullWidth validate={required()} />
      <SitesCheckboxInput source="sites" validate={required()} />
    </SimpleForm>
  </MyCreate>
)

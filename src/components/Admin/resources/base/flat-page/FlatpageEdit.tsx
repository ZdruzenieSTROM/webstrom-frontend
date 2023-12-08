import {FC} from 'react'
import {NumberInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const FlatpageEdit: FC = () => (
  <MyEdit>
    <SimpleForm>
      <NumberInput source="id" fullWidth disabled />
      <TextInput source="url" fullWidth validate={required()} />
      <TextInput source="title" fullWidth validate={required()} />
      <TextInput source="content" fullWidth validate={required()} />
      <SitesCheckboxInput source="sites" validate={required()} />
    </SimpleForm>
  </MyEdit>
)

import {FC} from 'react'
import {EmailField, ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const SchoolShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="street" />
      <TextField source="zip_code" />
      <ReferenceField source="district" reference="personal/districts" />
      <TextField source="abbreviation" />
      <EmailField source="email" />
    </SimpleShowLayout>
  </MyShow>
)

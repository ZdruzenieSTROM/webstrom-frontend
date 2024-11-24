import {FC} from 'react'
import {ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const ProfileShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <TextField source="school.verbose_name" />
      <ReferenceField source="grade" reference="competition/grade">
        <TextField source="tag" />
      </ReferenceField>
    </SimpleShowLayout>
  </MyShow>
)

import {FC} from 'react'
import {ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const ProfileShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <TextField source="first_name" label="Meno" />
      <TextField source="last_name" label="Priezvisko" />
      <TextField source="school.verbose_name" label="Škola" />
      <ReferenceField source="grade" reference="competition/grade" label="Ročník">
        <TextField source="tag" />
      </ReferenceField>
    </SimpleShowLayout>
  </MyShow>
)

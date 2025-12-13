import {FC} from 'react'
import {NumberField, ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'
import {MyShow} from '@/components/Admin/custom/MyShow'

export const PublicationShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <TextField source="name" />
      <ReferenceField source="event" reference="competition/event" link="show" />
      <ReferenceField source="publication_type" reference="competition/publication-type" />
      <NumberField source="order" />
      <MyShowFileField source="file" />
    </SimpleShowLayout>
  </MyShow>
)

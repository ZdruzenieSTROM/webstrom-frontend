import {FC} from 'react'
import {FileField, NumberField, ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const PublicationShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <TextField source="name" />
      <ReferenceField source="event" reference="competition/event" link="show" />
      <ReferenceField source="publication_type" reference="competition/publication-type" />
      <NumberField source="order" />
      <FileField source="file" title="Publikácia" />
    </SimpleShowLayout>
  </MyShow>
)

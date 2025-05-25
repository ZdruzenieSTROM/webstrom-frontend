import {FC} from 'react'
import {Datagrid, FileField, List, ReferenceField, TextField} from 'react-admin'

export const PublicationList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <ReferenceField source="event" reference="competition/event" link="show" />
      <ReferenceField source="publication_type" reference="competition/publication-type" />
      <FileField source="file" title="Publikácia" />
    </Datagrid>
  </List>
)

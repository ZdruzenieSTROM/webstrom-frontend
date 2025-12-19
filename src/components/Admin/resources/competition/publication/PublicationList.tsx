import {FC} from 'react'
import {Datagrid, List, ReferenceField, TextField} from 'react-admin'

import {MyShowFileField} from '@/components/Admin/custom/file-handling/MyShowFileField'

export const PublicationList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <ReferenceField source="event" reference="competition/event" link="show" />
      <ReferenceField source="publication_type" reference="competition/publication-type" />
      <MyShowFileField source="file" />
    </Datagrid>
  </List>
)

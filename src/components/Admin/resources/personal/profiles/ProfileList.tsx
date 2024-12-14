import {FC} from 'react'
import {Datagrid, List, ReferenceField, TextField} from 'react-admin'

export const ProfileList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <TextField source="school.verbose_name" />
      <ReferenceField source="grade" reference="competition/grade">
        <TextField source="tag" />
      </ReferenceField>
    </Datagrid>
  </List>
)

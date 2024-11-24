import {FC} from 'react'
import {Datagrid, List, ReferenceField, TextField} from 'react-admin'

export const ProfileList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="first_name" label="Meno" />
      <TextField source="last_name" label="Priezvisko" />
      <TextField source="school.verbose_name" label="Škola" />
      <ReferenceField source="grade" reference="competition/grade" label="Ročník">
        <TextField source="tag" />
      </ReferenceField>
    </Datagrid>
  </List>
)

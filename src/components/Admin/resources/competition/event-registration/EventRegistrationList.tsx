import {FC} from 'react'
import {Datagrid, List, ReferenceField} from 'react-admin'

export const EventRegistrationList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <ReferenceField source="school" reference="personal/schools" link={false} />
      <ReferenceField source="profile" reference="personal/profiles" link={false} />
      <ReferenceField source="event" reference="competition/event" link={false} />
    </Datagrid>
  </List>
)

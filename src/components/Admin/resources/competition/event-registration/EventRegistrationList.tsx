import {FC} from 'react'
import {Datagrid, FunctionField, List, ReferenceField, TextField} from 'react-admin'

import {EventRegistration} from '@/types/api/competition'

export const EventRegistrationList: FC = () => (
  <List>
    <Datagrid rowClick="show">
      <FunctionField
        source="profile.last_name"
        label="Meno a priezvisko"
        render={(record: EventRegistration) => `${record.profile.first_name} ${record.profile.last_name}`}
      />
      <TextField source="school.abbreviation" label="Škola" />
      <TextField source="grade.tag" label="Ročník" />
      <ReferenceField source="event" reference="competition/event" link={false} />
    </Datagrid>
  </List>
)

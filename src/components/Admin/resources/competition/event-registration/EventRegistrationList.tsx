import {FC} from 'react'
import {Datagrid, FunctionField, List, ReferenceField, TextField} from 'react-admin'

import {EventRegistration} from '@/types/api/competition'

export const EventRegistrationList: FC = () => (
  <List>
    <Datagrid>
      <FunctionField
        source="profile.last_name"
        label="content.labels.name"
        render={(record: EventRegistration) => `${record.profile.first_name} ${record.profile.last_name}`}
      />
      <TextField source="school.abbreviation" />
      <TextField source="grade.tag" />
      <ReferenceField source="event" reference="competition/event" link={false} />
    </Datagrid>
  </List>
)

// TODO: filtre a ordering podla  https://github.com/ZdruzenieSTROM/webstrom-backend/pull/460/files#diff-148e08b739e60a78edfc1e546340f501840b75f1646afa58ee524ff82cfc061eR905-R908

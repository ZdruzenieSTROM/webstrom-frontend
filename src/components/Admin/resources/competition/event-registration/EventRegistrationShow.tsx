import {FC} from 'react'
import {FunctionField, ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {EventRegistration} from '@/types/api/competition'

export const EventRegistrationShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <FunctionField
        source="profile.last_name"
        label="Meno a priezvisko"
        render={(record: EventRegistration) => `${record.profile.first_name} ${record.profile.last_name}`}
      />
      <TextField source="school.abbreviation" label="Škola" />
      <TextField source="grade.tag" label="Ročník" />
      <ReferenceField source="event" reference="competition/event" link={false} />
    </SimpleShowLayout>
  </MyShow>
)

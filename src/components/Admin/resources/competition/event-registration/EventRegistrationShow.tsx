import {FC} from 'react'
import {FunctionField, ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {EventRegistration} from '@/types/api/competition'

export const EventRegistrationShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <FunctionField
        source="profile.last_name"
        label="content.labels.name"
        render={(record: EventRegistration) => `${record.profile.first_name} ${record.profile.last_name}`}
      />
      <TextField source="school.abbreviation" />
      <TextField source="grade.tag" />
      <ReferenceField source="event" reference="competition/event" link={false} />
    </SimpleShowLayout>
  </MyShow>
)

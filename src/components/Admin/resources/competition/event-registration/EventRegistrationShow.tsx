import {FC} from 'react'
import {FunctionField, ReferenceField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'
import {Profile} from '@/types/api/personal'

export const EventRegistrationShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="profile.id" reference="personal/profiles" label="content.labels.name" link="show">
        <FunctionField render={(record: Profile) => `${record.first_name} ${record.last_name}`} />
      </ReferenceField>
      <ReferenceField source="profile.id" reference="personal/profiles" label="content.labels.email" link={false}>
        <TextField source="email" />
      </ReferenceField>
      <TextField source="school.abbreviation" />
      <TextField source="grade.tag" />
      <ReferenceField source="event" reference="competition/event" link={false} />
    </SimpleShowLayout>
  </MyShow>
)

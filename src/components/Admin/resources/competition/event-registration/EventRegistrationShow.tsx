import {FC} from 'react'
import {ReferenceField, SimpleShowLayout} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const EventRegistrationShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <ReferenceField source="school" reference="personal/schools" link="show" />
      <ReferenceField source="profile" reference="personal/profiles" link="show" />
      <ReferenceField source="event" reference="competition/event" link="show" />
    </SimpleShowLayout>
  </MyShow>
)

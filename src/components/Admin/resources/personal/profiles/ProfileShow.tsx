import {FC} from 'react'
import {Datagrid, Pagination, ReferenceField, ReferenceManyField, SimpleShowLayout, TextField} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const ProfileShow: FC = () => (
  <MyShow>
    <SimpleShowLayout>
      <TextField source="first_name" />
      <TextField source="last_name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="school.verbose_name" />
      <ReferenceField source="grade" reference="competition/grade">
        <TextField source="tag" />
      </ReferenceField>
      <ReferenceManyField
        reference="competition/event-registration"
        target="profile"
        label="content.labels.event_registrations"
        sort={{field: 'event__start', order: 'DESC'}}
        pagination={<Pagination />}
      >
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <ReferenceField source="event" reference="competition/event" link={false} sortable={false} />
          <TextField source="school.abbreviation" sortable={false} />
          <TextField source="grade.tag" sortable={false} />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </MyShow>
)

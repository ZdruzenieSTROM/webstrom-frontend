import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  DateField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'

export const EventShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <ReferenceField source="competition" reference="competition/event" />
          <NumberField source="year" />
          <NumberField source="season_code" />
          <TextField source="school_year" />
          <DateField source="start" />
          <DateField source="end" />
          <TextField source="additional_name" />

          <TextField source="registration_link.url" />
          <DateField source="registration_link.start" />
          <DateField source="registration_link.end" />
          <TextField source="registration_link.additional_info" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="publications">
        <SimpleShowLayout>
          <ArrayField source="publication_set">
            <Datagrid>
              <TextField source="name" />
              <TextField source="file" />
              <ReferenceField source="publication_type" reference="competition/publication-type">
                <TextField source="name" />
              </ReferenceField>
              <NumberField source="event" />
              <NumberField source="order" />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)

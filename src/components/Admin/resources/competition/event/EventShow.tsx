import {FC} from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {CompetitionField} from '@/components/Admin/custom/CompetitionField'
import {MyShowActions} from '@/components/Admin/custom/MyShowActions'

export const EventShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <TextField source="registration_link.url" />

          <NumberField source="id" />
          <CompetitionField source="competition" />
          <NumberField source="year" />
          <NumberField source="season_code" />
          <TextField source="school_year" />
          <DateField source="start" />
          <DateField source="end" />
          <TextField source="additional_name" />

          <BooleanField source="can_participate" />
          <BooleanField source="is_registered" />

          <NumberField source="registration_link.id" />
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
              <NumberField source="id" />
              <TextField source="name" />
              <TextField source="file" />
              <NumberField source="publication_type" />
              <NumberField source="event" />
              <NumberField source="order" />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)

import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  DateField,
  NumberField,
  ReferenceField,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {MyShow} from '@/components/Admin/custom/MyShow'

export const EventShow: FC = () => (
  <MyShow>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <ReferenceField source="competition" reference="competition/competition" link="show" />
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
              <ReferenceField source="publication_type" reference="competition/publication-type" link="show">
                <TextField source="name" />
              </ReferenceField>
              <NumberField source="event" />
              <NumberField source="order" />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </MyShow>
)

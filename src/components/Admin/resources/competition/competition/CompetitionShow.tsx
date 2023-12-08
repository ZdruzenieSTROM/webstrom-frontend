import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {JsonField} from '@/components/Admin/custom/JsonField'
import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const CompetitionShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <NumberField source="id" />
          <TextField source="name" />
          <TextField source="slug" />
          <NumberField source="start_year" />
          <TextField source="description" />
          <TruncatedTextField source="rules" maxTextWidth={200} />
          <NumberField source="competition_type.id" />
          <TextField source="competition_type.name" />
          <SitesArrayField source="sites" />
          <NumberField source="min_years_until_graduation" />
          <TextField source="who_can_participate" />
          <JsonField source="upcoming_or_current_event" />
        </SimpleShowLayout>
      </Tab>
      <Tab label="history_events">
        <SimpleShowLayout>
          <ArrayField source="history_events">
            <Datagrid>
              <NumberField source="id" />
              <NumberField source="year" />
              <TextField source="school_year" />
              <DateField source="start" />
              <DateField source="end" />
              <NumberField source="season_code" />
              <NumberField source="competition" />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)

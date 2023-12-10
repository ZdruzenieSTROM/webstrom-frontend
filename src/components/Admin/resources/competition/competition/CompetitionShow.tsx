import {Divider} from '@mui/material'
import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  DateField,
  FunctionField,
  NumberField,
  RaRecord,
  Show,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {MyShowActions} from '@/components/Admin/custom/MyShowActions'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

import {UpcomingOrCurrentEvent} from './UpcomingOrCurrentEvent'

export const CompetitionShow: FC = () => (
  <Show actions={<MyShowActions />}>
    <TabbedShowLayout>
      <Tab label="general">
        <SimpleShowLayout>
          <TextField source="name" />
          <TextField source="slug" />
          <TextField source="start_year" />
          <TruncatedTextField source="description" maxTextWidth={100} expandable />
          <TruncatedTextField source="rules" maxTextWidth={200} expandable />
          <TextField source="competition_type.name" label="Competition type" />
          <SitesArrayField source="sites" />
          <TextField source="who_can_participate" />
          <NumberField source="min_years_until_graduation" />

          <Divider />
          <UpcomingOrCurrentEvent />
        </SimpleShowLayout>
      </Tab>
      <Tab label="history_events">
        <SimpleShowLayout>
          <ArrayField source="history_events">
            <Datagrid rowClick={(id) => `/competition/event/${id}/show`}>
              <NumberField source="year" />
              <NumberField source="season_code" />
              <TextField source="school_year" />
              <DateField source="start" />
              <DateField source="end" />
              <FunctionField<RaRecord>
                source="publication_set"
                label="Publication count"
                render={(record) => record && <span>{record['publication_set'].length}</span>}
              />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </Show>
)

import {Divider} from '@mui/material'
import {FC} from 'react'
import {
  ArrayField,
  Datagrid,
  FunctionField,
  NumberField,
  RaRecord,
  SimpleShowLayout,
  Tab,
  TabbedShowLayout,
  TextField,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {MyShow} from '@/components/Admin/custom/MyShow'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

import {UpcomingOrCurrentEvent} from './UpcomingOrCurrentEvent'

export const CompetitionShow: FC = () => (
  <MyShow>
    <TabbedShowLayout>
      <Tab label="content.labels.general">
        <SimpleShowLayout>
          <TextField source="name" />
          <TextField source="slug" />
          <TextField source="start_year" />
          <TruncatedTextField source="description" maxTextWidth={100} expandable />
          <TruncatedTextField source="long_description" maxTextWidth={200} expandable />
          <TruncatedTextField source="rules" maxTextWidth={200} expandable />
          <TextField source="competition_type.name" label="content.labels.competition_type" />
          <SitesArrayField source="sites" />
          <TextField source="who_can_participate" />
          <NumberField source="min_years_until_graduation" />

          <Divider />
          <UpcomingOrCurrentEvent />
        </SimpleShowLayout>
      </Tab>
      <Tab label="content.labels.history_events">
        <SimpleShowLayout>
          <ArrayField source="history_events">
            <Datagrid rowClick={(id) => `/competition/event/${id}/show`}>
              <NumberField source="year" />
              <NumberField source="season_code" />
              <TextField source="school_year" />
              <DateTimeField source="start" />
              <DateTimeField source="end" />
              <FunctionField<RaRecord>
                source="publication_set"
                render={(record) => record && <span>{record['publication_set']?.length}</span>}
              />
            </Datagrid>
          </ArrayField>
        </SimpleShowLayout>
      </Tab>
    </TabbedShowLayout>
  </MyShow>
)

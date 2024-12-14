import {FC} from 'react'
import {Datagrid, FunctionField, List, NumberField, RaRecord, TextField} from 'react-admin'

import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const CompetitionList: FC = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="start_year" />
      <TruncatedTextField source="description" maxTextWidth={30} />
      <TruncatedTextField source="rules" maxTextWidth={30} />
      <TextField source="competition_type.name" label="content.labels.competition_type" />
      <SitesArrayField source="sites" />
      <TextField source="who_can_participate" />
      <NumberField source="min_years_until_graduation" />
      <FunctionField<RaRecord>
        source="history_events"
        label="content.labels.history_events_count"
        render={(record) => record && <span>{record['history_events'].length}</span>}
      />
    </Datagrid>
  </List>
)

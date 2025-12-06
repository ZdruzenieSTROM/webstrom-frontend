import {FC} from 'react'
import {Datagrid, FunctionField, List, NumberField, RaRecord, TextField} from 'react-admin'

import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SitesArrayField} from '@/components/Admin/custom/SitesArrayField'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const CompetitionList: FC = () => (
  <List aside={<CompetitionListFilters />}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="slug" sortable={false} />
      <TextField source="start_year" />
      <TruncatedTextField source="description" maxTextWidth={30} sortable={false} />
      <TruncatedTextField source="long_description" maxTextWidth={30} sortable={false} />
      <TruncatedTextField source="rules" maxTextWidth={30} sortable={false} />
      <TextField source="competition_type.name" label="content.labels.competition_type" sortable={false} />
      <SitesArrayField source="sites" sortable={false} />
      <TextField source="who_can_participate" sortable={false} />
      <NumberField source="min_years_until_graduation" sortable={false} />
      <FunctionField<RaRecord>
        source="history_events"
        label="content.labels.history_events_count"
        render={(record) => record && <span>{record['history_events']?.length}</span>}
        sortable={false}
      />
    </Datagrid>
  </List>
)

const CompetitionListFilters: FC = () => <FilterSidebar />

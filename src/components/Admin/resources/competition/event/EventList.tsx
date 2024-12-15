import {FC} from 'react'
import {Datagrid, FunctionField, List, NumberField, RaRecord, ReferenceField, TextField} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {CompetitionFilterSection} from '@/components/Admin/custom/list-filtering/CompetitionFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SeasonCodeFilterList} from '@/components/Admin/custom/list-filtering/SeasonCodeFilterList'
import {SeasonCodeField} from '@/components/Admin/custom/SeasonCodeField'

export const EventList: FC = () => (
  <List aside={<EventListFilters />}>
    <Datagrid>
      <ReferenceField source="competition" reference="competition/competition" link={false} sortable={false} />
      <NumberField source="year" />
      <SeasonCodeField source="season_code" sortable={false} />
      <TextField source="school_year" sortable={false} />
      <DateTimeField source="start" />
      <DateTimeField source="end" />
      <TextField source="location" sortable={false} />
      <TextField source="additional_name" sortable={false} />
      <TextField source="registration_link.url" sortable={false} />
      <FunctionField<RaRecord>
        source="publication_set"
        render={(record) => record && <span>{record['publication_set'].length}</span>}
        sortable={false}
      />
    </Datagrid>
  </List>
)

// TODO: filtre a ordering podla https://github.com/ZdruzenieSTROM/webstrom-backend/pull/460/files#diff-148e08b739e60a78edfc1e546340f501840b75f1646afa58ee524ff82cfc061eR832-R838
const EventListFilters: FC = () => (
  <FilterSidebar>
    <CompetitionFilterSection />

    <SeasonCodeFilterList />

    {/* TODO:
      - school_year
      - location */}
  </FilterSidebar>
)

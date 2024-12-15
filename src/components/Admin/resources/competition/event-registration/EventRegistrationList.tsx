import {FC} from 'react'
import {Datagrid, FunctionField, List, ReferenceField, TextField} from 'react-admin'

import {EventFilterSection} from '@/components/Admin/custom/list-filtering/EventFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {GradeFilterSection} from '@/components/Admin/custom/list-filtering/GradeFilterSection'
import {EventRegistration} from '@/types/api/competition'

export const EventRegistrationList: FC = () => (
  <List aside={<EventRegistrationListFilters />}>
    <Datagrid>
      <FunctionField
        source="profile.last_name"
        label="content.labels.name"
        render={(record: EventRegistration) => `${record.profile.first_name} ${record.profile.last_name}`}
        sortable={false}
      />
      <TextField source="school.abbreviation" sortable={false} />
      <TextField source="grade.tag" sortable={false} />
      {/* TODO: malo by to byt raditelne podla sortBy="event__start",
      ale akosi sa mi to nezda ze by fungovalo a navyse to zo zobrazenia nie je intuitivne */}
      <ReferenceField source="event" reference="competition/event" link={false} sortable={false} />
    </Datagrid>
  </List>
)

// TODO: filtre a ordering podla  https://github.com/ZdruzenieSTROM/webstrom-backend/pull/460/files#diff-148e08b739e60a78edfc1e546340f501840b75f1646afa58ee524ff82cfc061eR905-R908
const EventRegistrationListFilters: FC = () => (
  <FilterSidebar>
    <EventFilterSection />

    <GradeFilterSection />

    {/* TODO:
      - school
      - profile */}
  </FilterSidebar>
)

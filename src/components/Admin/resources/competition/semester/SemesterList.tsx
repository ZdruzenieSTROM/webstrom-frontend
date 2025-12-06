import {FC} from 'react'
import {
  BooleanField,
  Datagrid,
  FunctionField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
  TextField,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {CompetitionSeminarFilterSection} from '@/components/Admin/custom/list-filtering/CompetitionSeminarFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SeasonCodeFilterList} from '@/components/Admin/custom/list-filtering/SeasonCodeFilterList'
import {SeasonCodeField} from '@/components/Admin/custom/SeasonCodeField'

export const SemesterList: FC = () => (
  <List aside={<SemesterListFilters />}>
    <Datagrid>
      <ReferenceField source="competition" reference="competition/competition" link={false} sortable={false} />
      <NumberField source="year" />
      <SeasonCodeField source="season_code" sortable={false} />
      <TextField source="school_year" sortable={false} />
      <DateTimeField source="start" />
      <DateTimeField source="end" />
      <BooleanField source="complete" sortable={false} />
      <TextField source="additional_name" sortable={false} />
      <NumberField source="registration_link" sortable={false} />
      <FunctionField<RaRecord>
        source="series_set"
        render={(record) => record && <span>{record['series_set']?.length}</span>}
        sortable={false}
      />
      <FunctionField<RaRecord>
        source="publication_set"
        render={(record) => record && <span>{record['publication_set']?.length}</span>}
        sortable={false}
      />
      <FunctionField<RaRecord>
        source="late_tags"
        render={(record) => record && <span>{record['late_tags']?.length}</span>}
        sortable={false}
      />
    </Datagrid>
  </List>
)

const SemesterListFilters: FC = () => (
  <FilterSidebar>
    <CompetitionSeminarFilterSection />

    <SeasonCodeFilterList />

    {/* TODO:
        - school_year */}
  </FilterSidebar>
)

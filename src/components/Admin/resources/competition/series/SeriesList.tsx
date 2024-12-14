import {FC} from 'react'
import {
  BooleanField,
  Datagrid,
  FilterList,
  FilterListItem,
  FunctionField,
  List,
  RaRecord,
  ReferenceField,
  TextField,
} from 'react-admin'

import {DateTimeField} from '@/components/Admin/custom/DateTimeField'
import {CompetitionSeminarFilterSection} from '@/components/Admin/custom/list-filtering/CompetitionSeminarFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SemesterFilterSection} from '@/components/Admin/custom/list-filtering/SemesterFilterSection'

export const SeriesList: FC = () => (
  <List aside={<SeriesListFilters />}>
    <Datagrid>
      <ReferenceField source="semester" reference="competition/semester" link={false} sortable={false} />
      <DateTimeField source="deadline" />
      <TextField source="order" sortable={false} />
      <BooleanField source="complete" sortable={false} />
      <FunctionField<RaRecord>
        label="content.labels.problem_count"
        render={(record) => record && <span>{record['problems'].length}</span>}
        sortable={false}
      />
    </Datagrid>
  </List>
)

const SeriesListFilters: FC = () => (
  <FilterSidebar>
    <CompetitionSeminarFilterSection />

    <SemesterFilterSection />

    <FilterList label="Číslo seŕie" icon={null}>
      {[1, 2].map((seriesNumber) => (
        <FilterListItem key={seriesNumber} label={seriesNumber.toString()} value={{order: seriesNumber}} />
      ))}
    </FilterList>
  </FilterSidebar>
)

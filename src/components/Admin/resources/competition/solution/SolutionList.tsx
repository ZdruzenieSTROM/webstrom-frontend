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
} from 'react-admin'

import {CompetitionSeminarFilterSection} from '@/components/Admin/custom/list-filtering/CompetitionSeminarFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SemesterFilterSection} from '@/components/Admin/custom/list-filtering/SemesterFilterSection'
import {SeriesFilterSection} from '@/components/Admin/custom/list-filtering/SeriesFilterSection'

export const SolutionList: FC = () => (
  <List aside={<SolutionListFilters />}>
    <Datagrid>
      <ReferenceField source="problem" reference="competition/problem" link={false} />
      <ReferenceField source="semester_registration" reference="competition/event-registration" link={false} />
      <FunctionField<RaRecord>
        label="content.labels.has_solution"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution']}} source="xxx" />}
      />
      <FunctionField<RaRecord>
        source="late_tag"
        render={(record) => record && <span>{record['late_tag']?.name}</span>}
      />
      <BooleanField source="is_online" />
    </Datagrid>
  </List>
)

const SolutionListFilters: FC = () => (
  <FilterSidebar>
    <CompetitionSeminarFilterSection />

    <SemesterFilterSection />

    <SeriesFilterSection />

    <FilterList label="Číslo úlohy" icon={null}>
      {[1, 2, 3, 4, 5, 6].map((problemNumber) => (
        <FilterListItem key={problemNumber} label={problemNumber.toString()} value={{order: problemNumber}} />
      ))}
    </FilterList>
    <FilterList label="Chýba riešenie?" icon={null}>
      <FilterListItem label="Áno" value={{missing_file: true}} />
      <FilterListItem label="Nie" value={{missing_file: false}} />
    </FilterList>
    <FilterList label="Chýba opravené riešenie?" icon={null}>
      <FilterListItem label="Áno" value={{missing_corrected_file: true}} />
      <FilterListItem label="Nie" value={{missing_corrected_file: false}} />
    </FilterList>
  </FilterSidebar>
)

// TODO: filtre a ordering podla https://github.com/ZdruzenieSTROM/webstrom-backend/pull/460/files#diff-148e08b739e60a78edfc1e546340f501840b75f1646afa58ee524ff82cfc061eR537-R567

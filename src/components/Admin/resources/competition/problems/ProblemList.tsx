import {FC} from 'react'
import {
  BooleanField,
  Datagrid,
  FilterList,
  FilterListItem,
  FunctionField,
  ImageField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
} from 'react-admin'

import {CompetitionSeminarFilterSection} from '@/components/Admin/custom/list-filtering/CompetitionSeminarFilterSection'
import {FilterSidebar} from '@/components/Admin/custom/list-filtering/FilterSidebar'
import {SemesterFilterSection} from '@/components/Admin/custom/list-filtering/SemesterFilterSection'
import {SeriesFilterSection} from '@/components/Admin/custom/list-filtering/SeriesFilterSection'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemList: FC = () => (
  <List aside={<ProblemListFilters />}>
    <Datagrid>
      <ReferenceField source="series" reference="competition/series" link={false} sortable={false} />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={50} sortable={false} />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 100, height: 75}}} sortable={false} />
      <FunctionField<RaRecord>
        label="content.labels.has_vzorak"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution_pdf']}} source="xxx" />}
        sortable={false}
      />
      <NumberField source="num_comments" sortable={false} />
    </Datagrid>
  </List>
)

const ProblemListFilters: FC = () => (
  <FilterSidebar>
    <CompetitionSeminarFilterSection />

    <SemesterFilterSection />

    <SeriesFilterSection />

    <FilterList label="Číslo úlohy" icon={null}>
      {[1, 2, 3, 4, 5, 6].map((problemNumber) => (
        <FilterListItem key={problemNumber} label={problemNumber.toString()} value={{order: problemNumber}} />
      ))}
    </FilterList>
  </FilterSidebar>
)

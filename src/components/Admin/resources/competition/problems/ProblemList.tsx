import {FC} from 'react'
import {
  AutocompleteInput,
  BooleanField,
  Datagrid,
  FilterList,
  FilterListItem,
  FilterListSection,
  FilterLiveForm,
  FunctionField,
  ImageField,
  List,
  NumberField,
  RaRecord,
  ReferenceField,
  ReferenceInput,
} from 'react-admin'

import {FilterSidebar} from '@/components/Admin/custom/FilterSidebar'
import {TruncatedTextField} from '@/components/Admin/custom/TruncatedTextField'

export const ProblemList: FC = () => (
  <List aside={<ProblemListFilters />}>
    <Datagrid>
      <ReferenceField source="series" reference="competition/series" link={false} />
      <NumberField source="order" />
      <TruncatedTextField source="text" maxTextWidth={50} />
      <ImageField source="image" sx={{'& .RaImageField-image': {width: 100, height: 75}}} />
      <FunctionField<RaRecord>
        label="content.labels.has_vzorak"
        render={(record) => record && <BooleanField record={{xxx: !!record['solution_pdf']}} source="xxx" />}
      />
      <NumberField source="num_comments" />
    </Datagrid>
  </List>
)

const ProblemListFilters: FC = () => (
  <FilterSidebar>
    <FilterListSection label="Séria" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="series" reference="competition/series">
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
    <FilterList label="Číslo úlohy" icon={null}>
      {[1, 2, 3, 4, 5, 6].map((problemNumber) => (
        <FilterListItem key={problemNumber} label={problemNumber.toString()} value={{order: problemNumber}} />
      ))}
    </FilterList>
  </FilterSidebar>
)

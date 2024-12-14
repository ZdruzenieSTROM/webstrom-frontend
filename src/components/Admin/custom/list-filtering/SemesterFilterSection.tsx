import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput, useListContext} from 'react-admin'

export const SemesterFilterSection: FC = () => {
  const {filterValues} = useListContext()

  return (
    <FilterListSection label="Semester" icon={null}>
      <FilterLiveForm>
        <ReferenceInput
          source="semester"
          reference="competition/semester"
          filter={{competition: filterValues.competition}}
        >
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

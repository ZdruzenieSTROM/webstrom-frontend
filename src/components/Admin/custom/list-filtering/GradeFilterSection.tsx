import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput} from 'react-admin'

export const GradeFilterSection: FC = () => {
  return (
    <FilterListSection label="content.filters.grade" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="grade" reference="competition/grade">
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput} from 'react-admin'

export const GradeFilterSection: FC = () => {
  return (
    <FilterListSection label="Grade" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="grade" reference="competition/grade">
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

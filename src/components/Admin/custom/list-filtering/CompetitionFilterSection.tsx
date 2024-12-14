import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput} from 'react-admin'

export const CompetitionFilterSection: FC = () => {
  return (
    <FilterListSection label="Competition" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="competition" reference="competition/competition" filter={{competition_type: 0}}>
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

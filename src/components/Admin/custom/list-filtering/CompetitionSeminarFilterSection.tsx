import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput} from 'react-admin'

export const CompetitionSeminarFilterSection: FC = () => {
  return (
    <FilterListSection label="Seminar" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="competition" reference="competition/competition" filter={{competition_type: 0}}>
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

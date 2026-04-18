import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput} from 'react-admin'

export const PublicationTypeFilterSection: FC = () => {
  return (
    <FilterListSection label="Typ" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="publication_type" reference="competition/publication-type">
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

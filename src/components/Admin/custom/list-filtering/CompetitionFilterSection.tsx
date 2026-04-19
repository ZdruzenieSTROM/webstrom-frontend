import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, RaRecord, ReferenceInput} from 'react-admin'

type Props = {
  filter?: Partial<RaRecord>
}

export const CompetitionFilterSection: FC<Props> = ({filter}) => {
  return (
    <FilterListSection label="Competition" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="competition" reference="competition/competition" filter={filter}>
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

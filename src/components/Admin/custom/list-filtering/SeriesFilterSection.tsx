import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput, useListContext} from 'react-admin'

export const SeriesFilterSection: FC = () => {
  const {filterValues} = useListContext()

  return (
    <FilterListSection label="Séria" icon={null}>
      <FilterLiveForm>
        <ReferenceInput
          source="series"
          reference="competition/series"
          filter={{competition: filterValues.competition, semester: filterValues.semester}}
        >
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

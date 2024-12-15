import {FC} from 'react'
import {AutocompleteInput, FilterListSection, FilterLiveForm, ReferenceInput} from 'react-admin'

export const EventFilterSection: FC = () => {
  return (
    <FilterListSection label="Event" icon={null}>
      <FilterLiveForm>
        <ReferenceInput source="event" reference="competition/event">
          <AutocompleteInput helperText={false} />
        </ReferenceInput>
      </FilterLiveForm>
    </FilterListSection>
  )
}

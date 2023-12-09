import {FC} from 'react'
import {ArrayInput, FormTab, NumberInput, required, SimpleFormIterator, TabbedForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const CompetitionEdit: FC = () => (
  <MyEdit>
    <TabbedForm>
      <FormTab label="general">
        <TextInput source="name" fullWidth />
        <NumberInput source="start_year" fullWidth />
        <TextInput source="description" fullWidth />
        <TextInput source="rules" fullWidth />
        <NumberInput source="competition_type" fullWidth />
        <NumberInput source="min_years_until_graduation" fullWidth />
        <SitesCheckboxInput source="sites" validate={required()} />
      </FormTab>
      <FormTab label="events">
        <ArrayInput source="event_set" defaultValue={[]}>
          <SimpleFormIterator>
            {/* unspecifiedpublication_set: UnspecifiedPublication[]
                registration_links: RegistrationLink[] */}
            <NumberInput source="year" fullWidth />
            <TextInput source="shool_year" fullWidth /* validate={required()} */ />
            <TextInput source="start" fullWidth validate={required()} />
            <TextInput source="end" fullWidth validate={required()} />
            <NumberInput source="competition" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </MyEdit>
)

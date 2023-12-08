import {FC} from 'react'
import {
  ArrayInput,
  DateTimeInput,
  FormTab,
  NumberInput,
  required,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const CompetitionCreate: FC = () => (
  <MyCreate>
    <TabbedForm>
      <FormTab label="general">
        {/* <NumberInput source="id" fullWidth disabled /> */}
        <TextInput source="name" fullWidth validate={required()} />
        <NumberInput source="start_year" fullWidth validate={required()} />
        <TextInput source="description" fullWidth />
        <TextInput source="rules" fullWidth />
        {/* TODO: radio buttons / select */}
        <NumberInput source="competition_type" fullWidth validate={required()} />
        <NumberInput source="min_years_until_graduation" fullWidth />
        <SitesCheckboxInput source="sites" validate={required()} />
      </FormTab>
      {/* maju sa dat eventy vytvarat pri tvoreni competition? */}
      <FormTab label="events">
        <ArrayInput source="event_set" defaultValue={[]}>
          <SimpleFormIterator>
            {/* <NumberInput source="id" fullWidth disabled /> */}
            <NumberInput source="year" fullWidth />
            <TextInput source="school_year" fullWidth /* validate={required()} */ />
            <DateTimeInput source="start" fullWidth validate={required()} />
            <DateTimeInput source="end" fullWidth validate={required()} />
            <NumberInput source="competition" fullWidth />
            {/* unspecifiedpublication_set: UnspecifiedPublication[]
                registration_links: RegistrationLink[] */}
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </MyCreate>
)

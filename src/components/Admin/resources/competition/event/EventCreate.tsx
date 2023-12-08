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

import {CompetitionInput} from '@/components/Admin/custom/CompetitionInput'
import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const EventCreate: FC = () => (
  <MyCreate>
    <TabbedForm>
      <FormTab label="general">
        <NumberInput source="id" fullWidth disabled />
        <NumberInput source="year" fullWidth validate={required()} />
        <TextInput source="school_year" fullWidth validate={required()} />
        <span>napr. 2023/2024</span>
        <DateTimeInput source="start" fullWidth validate={required()} />
        <DateTimeInput source="end" fullWidth validate={required()} />
        <CompetitionInput source="competition" fullWidth validate={required()} />

        <span>TODO: always sends null as registration_link</span>
        <TextInput source="registration_link" fullWidth hidden disabled defaultValue={null} parse={() => null} />
        {/* <NumberInput source="registration_link.id" fullWidth disabled />
        <TextInput source="registration_link.url" fullWidth />
        <DateInput source="registration_link.start" fullWidth />
        <DateInput source="registration_link.end" fullWidth />
        <TextInput source="registration_link.additional_info" fullWidth /> */}
      </FormTab>
      <FormTab label="publications">
        <span>TODO: publikacie treba vediet nahrat, nie tu editovat db</span>
        <ArrayInput source="publication_set" defaultValue={[]}>
          <SimpleFormIterator>
            <NumberInput source="id" fullWidth disabled />
            <TextInput source="name" fullWidth validate={required()} />
            <TextInput source="file" fullWidth validate={required()} />
            <NumberInput source="publication_type" fullWidth />
            <NumberInput source="event" fullWidth disabled />
            <NumberInput source="order" fullWidth />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </MyCreate>
)

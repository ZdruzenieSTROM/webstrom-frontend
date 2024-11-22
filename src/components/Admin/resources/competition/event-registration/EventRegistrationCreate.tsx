import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const EventRegistrationCreate: FC = () => (
  <MyCreate>
    <SimpleForm>
      <ReferenceInput source="profile" reference="personal/profiles">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="school" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="grade" reference="competition/grade">
        <AutocompleteInput optionText="name" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="event" reference="competition/event">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </MyCreate>
)

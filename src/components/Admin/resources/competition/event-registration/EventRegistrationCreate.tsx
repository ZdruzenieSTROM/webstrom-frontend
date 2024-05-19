import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const EventRegistrationCreate: FC = () => (
  <MyCreate>
    <SimpleForm>
      <ReferenceInput source="school" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" optionValue="code" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="profile" reference="personal/profiles">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </MyCreate>
)

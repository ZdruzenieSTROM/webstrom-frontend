import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const EventRegistrationEdit: FC = () => (
  <MyEdit>
    <SimpleForm>
      <ReferenceInput source="school" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" optionValue="code" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="profile" reference="personal/profiles">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="event" reference="competition/event">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </MyEdit>
)

import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const ProfileEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      const {school, ...rest} = record
      return {...rest, school_id: school.code}
    }}
  >
    <SimpleForm>
      <TextInput source="first_name" validate={required()} />
      <TextInput source="last_name" validate={required()} />
      <ReferenceInput source="school.code" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="grade" reference="competition/grade">
        <AutocompleteInput optionText="name" fullWidth validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </MyEdit>
)

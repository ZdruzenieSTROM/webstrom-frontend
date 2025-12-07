import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyToolbar} from '@/components/Admin/custom/MyToolbar'

export const ProfileEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      const {school, ...rest} = record
      return {...rest, school_id: school.code}
    }}
  >
    <SimpleForm toolbar={<MyToolbar />}>
      <TextInput source="first_name" validate={required()} />
      <TextInput source="last_name" validate={required()} />
      <ReferenceInput source="school.code" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="grade" reference="competition/grade">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </MyEdit>
)

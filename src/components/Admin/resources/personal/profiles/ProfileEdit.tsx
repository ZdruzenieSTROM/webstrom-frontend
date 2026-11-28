import {FC} from 'react'
import {AutocompleteInput, email, ReferenceInput, required, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const ProfileEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      const {school, ...rest} = record
      return {...rest, school_id: school.code}
    }}
  >
    <MySimpleForm toolbar={<MyEditToolbar />}>
      <TextInput source="first_name" validate={required()} />
      <TextInput source="last_name" validate={required()} />
      <TextInput source="email" validate={email()} disabled />
      <TextInput source="phone" />
      <ReferenceInput source="school.code" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="grade" reference="competition/grade">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
    </MySimpleForm>
  </MyEdit>
)

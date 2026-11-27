import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const ProfileCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      const {school, ...rest} = record
      return {...rest, school_id: school}
    }}
  >
    <MySimpleForm toolbar={<MyCreateToolbar />}>
      <TextInput source="first_name" validate={required()} />
      <TextInput source="last_name" validate={required()} />
      <ReferenceInput source="school" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="grade" reference="competition/grade">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
    </MySimpleForm>
  </MyCreate>
)

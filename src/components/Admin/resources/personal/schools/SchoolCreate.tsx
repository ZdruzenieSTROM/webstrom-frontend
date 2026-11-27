import {FC} from 'react'
import {AutocompleteInput, email, ReferenceInput, required, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const SchoolCreate: FC = () => (
  <MyCreate>
    <MySimpleForm toolbar={<MyCreateToolbar />}>
      <TextInput source="name" helperText="content.helpers.school_name" validate={required()} />
      <TextInput source="street" validate={required()} />
      <TextInput source="city" validate={required()} />
      <TextInput source="zip_code" helperText="content.helpers.school_zip_code" validate={required()} />
      <ReferenceInput source="district" reference="personal/districts">
        <AutocompleteInput validate={required()} />
      </ReferenceInput>
      <TextInput source="abbreviation" helperText="content.helpers.school_abbreviation" validate={required()} />
      <TextInput source="email" helperText="content.helpers.school_email" validate={email()} />
    </MySimpleForm>
  </MyCreate>
)

import {FC} from 'react'
import {AutocompleteInput, email, ReferenceInput, required, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const SchoolEdit: FC = () => (
  <MyEdit>
    <MySimpleForm toolbar={<MyEditToolbar />}>
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
  </MyEdit>
)

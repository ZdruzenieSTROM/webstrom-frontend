import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const ProfileCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      const {school, ...rest} = record
      return {...rest, school_id: school}
    }}
  >
    <SimpleForm>
      <TextInput source="first_name" label="Meno" validate={required()} />
      <TextInput source="last_name" label="Priezvisko" validate={required()} />
      <ReferenceInput source="school" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} label="Škola" />
      </ReferenceInput>
      <ReferenceInput source="grade" reference="competition/grade">
        <AutocompleteInput optionText="name" fullWidth validate={required()} label="Ročník" />
      </ReferenceInput>
    </SimpleForm>
  </MyCreate>
)

import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const EventRegistrationEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.profile = record.profile.id
      record.school = record.school.code
      record.grade = record.grade.id
      return record
    }}
  >
    <SimpleForm>
      <ReferenceInput source="profile.id" reference="personal/profiles">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="school.code" reference="personal/schools">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="grade.id" reference="competition/grade">
        <AutocompleteInput optionText="name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="event" reference="competition/event">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
    </SimpleForm>
  </MyEdit>
)

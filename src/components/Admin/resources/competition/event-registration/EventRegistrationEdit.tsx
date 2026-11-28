import {FC} from 'react'
import {AutocompleteInput, ReferenceInput, required} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

export const EventRegistrationEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.profile = record.profile.id
      record.school = record.school.code
      record.grade = record.grade.id
      return record
    }}
  >
    <MySimpleForm toolbar={<MyEditToolbar />}>
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
    </MySimpleForm>
  </MyEdit>
)

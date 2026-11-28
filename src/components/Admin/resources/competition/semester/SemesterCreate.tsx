import {FC} from 'react'
import {
  CheckboxGroupInput,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MySimpleForm} from '@/components/Admin/custom/MySimpleForm'

import {seasonCodeStrings} from '../../../seasonCodeStrings'

export const SemesterCreate: FC = () => (
  <MyCreate>
    <MySimpleForm toolbar={<MyCreateToolbar />}>
      <ReferenceInput source="competition" reference="competition/competition" filter={{competition_type: 0}}>
        <SelectInput validate={required()} />
      </ReferenceInput>
      <NumberInput source="year" helperText="content.helpers.event_year" validate={required()} />
      <SelectInput source="season_code" choices={seasonCodeStrings} validate={required()} />
      <TextInput source="school_year" helperText="content.helpers.school_year" />
      <MyDateTimeInput source="start" validate={required()} />
      <MyDateTimeInput source="end" validate={required()} />
      <ReferenceArrayInput source="late_tags" reference="competition/late-tag">
        <CheckboxGroupInput
          label="resources.competition/semester.fields.late_tags"
          helperText="content.helpers.late_tags"
        />
      </ReferenceArrayInput>
    </MySimpleForm>
  </MyCreate>
)

import {FC} from 'react'
import {
  CheckboxGroupInput,
  FormTab,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
} from 'react-admin'

import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {validateDateAfter} from '@/utils/validateDateAfter'

import {seasonCodeStrings} from '../../../seasonCodeStrings'

export const SemesterEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      // automaticky sa na BE posiela cely record, ale BE read_only (aj neexistujuce) fieldy ignoruje
      // radsej z payloadu odstranime aspon sety
      delete record.publication_set
      delete record.series_set
      return record
    }}
  >
    <MyTabbedForm toolbar={<MyEditToolbar />}>
      <FormTab label="content.labels.general">
        <ReferenceInput source="competition" reference="competition/competition" filter={{competition_type: 0}}>
          <SelectInput validate={required()} />
        </ReferenceInput>
        <NumberInput source="year" helperText="content.helpers.event_year" />
        <SelectInput source="season_code" choices={seasonCodeStrings} validate={required()} />
        <TextInput source="school_year" helperText="content.helpers.school_year" />
        <MyDateTimeInput source="start" />
        <MyDateTimeInput source="end" validate={validateDateAfter('start')} />
        <ReferenceArrayInput source="late_tags" reference="competition/late-tag">
          <CheckboxGroupInput
            label="resources.competition/semester.fields.late_tags"
            helperText="content.helpers.late_tags"
          />
        </ReferenceArrayInput>
      </FormTab>
    </MyTabbedForm>
  </MyEdit>
)

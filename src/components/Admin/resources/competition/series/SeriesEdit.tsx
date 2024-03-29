import {FC} from 'react'
import {
  BooleanInput,
  DateTimeInput,
  FormTab,
  ReferenceInput,
  required,
  SelectInput,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const SeriesEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      // automaticky sa na BE posiela cely record, ale BE read_only (aj neexistujuce) fieldy ignoruje
      // radsej z payloadu odstranime aspon sety
      delete record.problems
      return record
    }}
  >
    <TabbedForm>
      <FormTab label="general">
        <ReferenceInput source="semester" reference="competition/semester">
          <SelectInput fullWidth validate={required()} />
        </ReferenceInput>
        <DateTimeInput source="deadline" fullWidth validate={required()} />
        <TextInput source="order" fullWidth validate={required()} />
        <BooleanInput source="complete" disabled />
      </FormTab>
    </TabbedForm>
  </MyEdit>
)

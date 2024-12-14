import {FC} from 'react'
import {BooleanInput, FormTab, ReferenceInput, required, SelectInput, TabbedForm, TextInput} from 'react-admin'

import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
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
      <FormTab label="content.labels.general">
        <ReferenceInput source="semester" reference="competition/semester">
          <SelectInput fullWidth validate={required()} />
        </ReferenceInput>
        <MyDateTimeInput source="deadline" fullWidth validate={required()} />
        <TextInput source="order" fullWidth validate={required()} />
        <BooleanInput source="complete" disabled />
      </FormTab>
    </TabbedForm>
  </MyEdit>
)

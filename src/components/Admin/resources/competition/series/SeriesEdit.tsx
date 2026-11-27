import {FC} from 'react'
import {AutocompleteInput, FormTab, NumberInput, ReferenceInput, required} from 'react-admin'

import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'

export const SeriesEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      // automaticky sa na BE posiela cely record, ale BE read_only (aj neexistujuce) fieldy ignoruje
      // radsej z payloadu odstranime aspon sety
      delete record.problems
      return record
    }}
  >
    <MyTabbedForm toolbar={<MyEditToolbar />}>
      <FormTab label="content.labels.general">
        <ReferenceInput source="semester" reference="competition/semester">
          <AutocompleteInput optionText="verbose_name" validate={required()} />
        </ReferenceInput>
        <MyDateTimeInput source="deadline" validate={required()} />
        <NumberInput source="order" validate={required()} />
      </FormTab>
    </MyTabbedForm>
  </MyEdit>
)

import {FC} from 'react'
import {AutocompleteInput, FormTab, NumberInput, ReferenceInput, required, TabbedForm} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'

export const SeriesCreate: FC = () => (
  <MyCreate
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
          <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
        </ReferenceInput>
        <MyDateTimeInput source="deadline" fullWidth validate={required()} />
        <NumberInput source="order" fullWidth validate={required()} />
      </FormTab>
    </TabbedForm>
  </MyCreate>
)

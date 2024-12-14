import {FC} from 'react'
import {BooleanInput, FormTab, ReferenceInput, required, SelectInput, TabbedForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'

export const SeriesCreate: FC = () => (
  <MyCreate>
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
  </MyCreate>
)

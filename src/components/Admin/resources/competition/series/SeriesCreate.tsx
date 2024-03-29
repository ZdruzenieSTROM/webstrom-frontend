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

import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const SeriesCreate: FC = () => (
  <MyCreate>
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
  </MyCreate>
)

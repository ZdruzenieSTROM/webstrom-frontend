import {FC} from 'react'
import {FormTab, ReferenceInput, required, SelectInput, TabbedForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const ProblemCreate: FC = () => (
  <MyCreate>
    <TabbedForm>
      <FormTab label="general">
        <ReferenceInput source="series" reference="competition/series">
          <SelectInput fullWidth validate={required()} optionText="id" />
        </ReferenceInput>
        <TextInput source="text" multiline fullWidth validate={required()} />
        <TextInput source="order" fullWidth validate={required()} />
        TODO: image
        {/* source="image" */}
      </FormTab>
    </TabbedForm>
  </MyCreate>
)

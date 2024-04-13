import {FC} from 'react'
import {FormTab, ReferenceInput, required, SelectInput, TabbedForm, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'

export const ProblemEdit: FC = () => (
  <MyEdit>
    <TabbedForm>
      <FormTab label="general">
        <ReferenceInput source="series" reference="competition/series">
          <SelectInput fullWidth validate={required()} />
        </ReferenceInput>
        <TextInput source="text" multiline fullWidth validate={required()} />
        <TextInput source="order" fullWidth validate={required()} />
        TODO: image
        {/* source="image" */}
      </FormTab>
    </TabbedForm>
  </MyEdit>
)

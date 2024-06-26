import {FC} from 'react'
import {FormTab, NumberInput, required, TabbedForm, TextInput} from 'react-admin'

import {FlatpagePreview} from '@/components/Admin/custom/FlatpagePreview'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const FlatpageEdit: FC = () => (
  <MyEdit>
    <TabbedForm>
      <FormTab label="general">
        <NumberInput source="id" fullWidth disabled />
        <TextInput source="url" fullWidth validate={required()} />
        <TextInput source="title" fullWidth validate={required()} />
        <TextInput source="content" multiline fullWidth validate={required()} />
        <SitesCheckboxInput source="sites" validate={required()} />
      </FormTab>
      <FormTab label="preview">
        <FlatpagePreview />
      </FormTab>
    </TabbedForm>
  </MyEdit>
)

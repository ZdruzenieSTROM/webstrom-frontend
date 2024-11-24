import {FC} from 'react'
import {FormTab, NumberInput, required, TabbedForm, TextInput} from 'react-admin'

import {FlatpagePreview} from '@/components/Admin/custom/FlatpagePreview'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const FlatpageCreate: FC = () => (
  <MyCreate>
    <TabbedForm>
      <FormTab label="content.labels.general">
        <NumberInput source="id" fullWidth disabled />
        <TextInput source="url" fullWidth validate={required()} />
        <TextInput source="title" fullWidth validate={required()} />
        <TextInput source="content" multiline fullWidth validate={required()} />
        <SitesCheckboxInput source="sites" validate={required()} />
      </FormTab>
      <FormTab label="content.labels.preview">
        <FlatpagePreview />
      </FormTab>
    </TabbedForm>
  </MyCreate>
)

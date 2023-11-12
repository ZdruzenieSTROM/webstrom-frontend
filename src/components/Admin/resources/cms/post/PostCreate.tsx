import {FC} from 'react'
import {ArrayInput, Create, FormTab, required, SimpleFormIterator, TabbedForm, TextInput} from 'react-admin'

import {MyDateInput} from '@/components/Admin/custom/MyDateInput'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const PostCreate: FC = () => (
  <Create redirect="show">
    <TabbedForm>
      <FormTab label="general">
        {/* <NumberInput source="id" fullWidth disabled /> */}
        <TextInput source="caption" fullWidth validate={required()} />
        <TextInput source="short_text" fullWidth validate={required()} />
        <TextInput source="details" fullWidth />
        {/* <MyDateInput source="added_at" fullWidth disabled /> */}
        <MyDateInput source="visible_after" fullWidth validate={required()} />
        <MyDateInput source="visible_until" fullWidth validate={required()} />
        <SitesCheckboxInput source="sites" />
      </FormTab>
      <FormTab label="links">
        <ArrayInput source="links" defaultValue={[]}>
          <SimpleFormIterator>
            {/* <NumberInput source="id" fullWidth disabled /> */}
            <TextInput source="caption" fullWidth validate={required()} />
            <TextInput source="url" fullWidth validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Create>
)

import {FC} from 'react'
import {
  ArrayInput,
  DateTimeInput,
  FormTab,
  NumberInput,
  required,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const PostEdit: FC = () => (
  <MyEdit>
    <TabbedForm>
      <FormTab label="general">
        <NumberInput source="id" fullWidth disabled />
        <TextInput source="caption" fullWidth validate={required()} />
        <TextInput source="short_text" fullWidth validate={required()} />
        <TextInput source="details" fullWidth />
        <DateTimeInput source="added_at" fullWidth disabled />
        <DateTimeInput source="visible_after" fullWidth validate={required()} />
        <DateTimeInput source="visible_until" fullWidth validate={required()} />
        <SitesCheckboxInput source="sites" validate={required()} />
      </FormTab>
      <FormTab label="links">
        <ArrayInput source="links" defaultValue={[]}>
          <SimpleFormIterator>
            <NumberInput source="id" fullWidth disabled />
            <TextInput source="caption" fullWidth validate={required()} />
            <TextInput source="url" fullWidth validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </MyEdit>
)

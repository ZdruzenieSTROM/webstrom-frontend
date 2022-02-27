import {FC} from 'react'
import {
  ArrayInput,
  Edit,
  EditProps,
  FormTab,
  NumberInput,
  required,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {MyDateInput} from '@/components/Admin/custom/MyDateInput'
import {MyEditActions} from '@/components/Admin/custom/MyEditActions'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const PostEdit: FC<EditProps> = (props) => (
  <Edit {...props} actions={<MyEditActions />} undoable={false}>
    <TabbedForm redirect="show">
      <FormTab label="general">
        <NumberInput source="id" fullWidth disabled />
        <TextInput source="caption" fullWidth validate={required()} />
        <TextInput source="short_text" fullWidth validate={required()} />
        <TextInput source="details" fullWidth />
        <MyDateInput source="added_at" fullWidth disabled />
        <MyDateInput source="show_after" fullWidth validate={required()} />
        <MyDateInput source="disable_after" fullWidth validate={required()} />
        <SitesCheckboxInput source="sites" />
      </FormTab>
      <FormTab label="links">
        <ArrayInput source="links" initialValue={[]}>
          <SimpleFormIterator>
            <NumberInput source="id" fullWidth disabled />
            <TextInput source="caption" fullWidth validate={required()} />
            <TextInput source="url" fullWidth validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
)
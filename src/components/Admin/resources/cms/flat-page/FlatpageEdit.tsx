import {FC} from 'react'
import {FormTab, required, TextInput} from 'react-admin'

import {FlatpagePreview} from '@/components/Admin/custom/FlatpagePreview'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'

export const FlatpageEdit: FC = () => (
  <MyEdit>
    <MyTabbedForm>
      <FormTab label="content.labels.general">
        <TextInput source="url" validate={required()} />
        <TextInput source="title" validate={required()} />
        <TextInput source="content" multiline validate={required()} helperText="content.helpers.markdown" />
      </FormTab>
      <FormTab label="content.labels.preview">
        <FlatpagePreview />
      </FormTab>
    </MyTabbedForm>
  </MyEdit>
)

import {FC} from 'react'
import {FormTab, required, TabbedForm, TextInput} from 'react-admin'

import {FlatpagePreview} from '@/components/Admin/custom/FlatpagePreview'
import {MyCreate} from '@/components/Admin/custom/MyCreate'

export const FlatpageCreate: FC = () => (
  <MyCreate>
    <TabbedForm>
      <FormTab label="content.labels.general">
        <TextInput source="url" fullWidth validate={required()} />
        <TextInput source="title" fullWidth validate={required()} />
        <TextInput
          source="content"
          multiline
          fullWidth
          validate={required()}
          helperText="Úlohy môžu obsahovať iba TeX a Markdown (nie HTML). Návod: https://www.markdownguide.org/basic-syntax/"
        />
      </FormTab>
      <FormTab label="content.labels.preview">
        <FlatpagePreview />
      </FormTab>
    </TabbedForm>
  </MyCreate>
)

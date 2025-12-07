import {FC} from 'react'
import {ArrayInput, FormTab, maxLength, required, SimpleFormIterator, TabbedForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {PostPreview} from '@/components/Admin/custom/PostPreview'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const PostCreate: FC = () => {
  return (
    <MyCreate>
      <TabbedForm toolbar={<MyCreateToolbar />}>
        <FormTab label="content.labels.general">
          <TextInput source="caption" validate={required()} />
          <TextInput source="short_text" validate={maxLength(200, 'Text musí mať najviac 200 znakov.')} />
          <TextInput
            source="details"
            multiline
            helperText="Text môže obsahovať iba TeX (iba matický mód) a Markdown (nie HTML). Návod: https://www.markdownguide.org/basic-syntax/"
          />
          {/* <MyDateTimeInput source="added_at" disabled /> */}
          <MyDateTimeInput source="visible_after" validate={required()} />
          <MyDateTimeInput source="visible_until" validate={required()} />
          <SitesCheckboxInput source="sites" validate={required()} />
        </FormTab>
        <FormTab label="content.labels.links">
          <ArrayInput source="links" defaultValue={[]}>
            <SimpleFormIterator>
              <TextInput source="caption" validate={required()} />
              <TextInput source="url" validate={required()} />
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
        <FormTab label="content.labels.preview">
          <PostPreview />
        </FormTab>
      </TabbedForm>
    </MyCreate>
  )
}

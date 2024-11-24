import {FC} from 'react'
import {ArrayInput, FormTab, maxLength, required, SimpleFormIterator, TabbedForm, TextInput} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {PostPreview} from '@/components/Admin/custom/PostPreview'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const PostCreate: FC = () => {
  return (
    <MyCreate>
      <TabbedForm>
        <FormTab label="general">
          <TextInput source="caption" fullWidth validate={required()} />
          <TextInput source="short_text" fullWidth validate={maxLength(200, 'Text musí mať najviac 200 znakov.')} />
          <TextInput source="details" multiline fullWidth />
          {/* <MyDateTimeInput source="added_at" fullWidth disabled /> */}
          <MyDateTimeInput source="visible_after" fullWidth validate={required()} />
          <MyDateTimeInput source="visible_until" fullWidth validate={required()} />
          <SitesCheckboxInput source="sites" validate={required()} />
        </FormTab>
        <FormTab label="links">
          <ArrayInput source="links" defaultValue={[]}>
            <SimpleFormIterator>
              <TextInput source="caption" fullWidth validate={required()} />
              <TextInput source="url" fullWidth validate={required()} />
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>
        <FormTab label="preview">
          <PostPreview />
        </FormTab>
      </TabbedForm>
    </MyCreate>
  )
}

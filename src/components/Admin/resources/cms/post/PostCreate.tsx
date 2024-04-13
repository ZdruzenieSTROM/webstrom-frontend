import {FC} from 'react'
import {
  ArrayInput,
  DateTimeInput,
  FormDataConsumer,
  FormTab,
  required,
  SimpleFormIterator,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {PostPreview} from '@/components/Admin/custom/PostPreview'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'
import {IPost, Post} from '@/components/Posts/Post'
import {PostMarkdown} from '@/components/Posts/PostMarkdown'

export const PostCreate: FC = () => {
  return (
    <MyCreate>
      <TabbedForm>
        <FormTab label="general">
          <TextInput source="caption" fullWidth validate={required()} />
          <TextInput source="short_text" fullWidth validate={required()} />
          <TextInput source="details" multiline fullWidth />
          <DateTimeInput source="added_at" fullWidth disabled />
          <DateTimeInput source="visible_after" fullWidth validate={required()} />
          <DateTimeInput source="visible_until" fullWidth validate={required()} />
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

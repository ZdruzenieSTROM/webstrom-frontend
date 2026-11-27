import {FC} from 'react'
import {ArrayInput, FormTab, maxLength, required, SimpleFormIterator, TextInput} from 'react-admin'

import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditActions} from '@/components/Admin/custom/MyEditActions'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'
import {PostPreview} from '@/components/Admin/custom/PostPreview'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const PostEdit: FC = () => (
  <MyEdit
    // the preview tab exists only on edit, PostShow has 2 tabs
    actions={<MyEditActions showTabs={2} />}
    transform={(record) => ({
      ...record,
      details: record.details ?? '',
    })}
  >
    <MyTabbedForm toolbar={<MyEditToolbar />}>
      <FormTab label="content.labels.general">
        <TextInput source="caption" validate={required()} />
        <TextInput source="short_text" validate={maxLength(200)} />
        <TextInput source="details" multiline helperText="content.helpers.markdown" />
        <MyDateTimeInput source="added_at" disabled />
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
    </MyTabbedForm>
  </MyEdit>
)

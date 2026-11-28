import {FC} from 'react'
import {AutocompleteInput, FormTab, ReferenceInput, required, TextInput} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyTabbedForm} from '@/components/Admin/custom/MyTabbedForm'

export const GalleryEdit: FC = () => (
  <MyEdit>
    <MyTabbedForm>
      <FormTab label="content.labels.general">
        <TextInput source="name" validate={required()} />
        <TextInput source="gallery_link" validate={required()} />
        <ReferenceInput source="event" reference="competition/event">
          <AutocompleteInput optionText="verbose_name" validate={required()} />
        </ReferenceInput>
      </FormTab>
    </MyTabbedForm>
  </MyEdit>
)

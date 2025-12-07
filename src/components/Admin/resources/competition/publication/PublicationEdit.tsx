import {FC} from 'react'
import {
  AutocompleteInput,
  FileInput,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzoneAccept'

import {createPublicationFormData} from './createPublicationFormData'

export const PublicationEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createPublicationFormData(record)
      return record
    }}
  >
    <SimpleForm toolbar={<MyEditToolbar />}>
      <TextInput source="name" isRequired={true} />
      <ReferenceInput source="event" reference="competition/event" isRequired={true}>
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="publication_type" reference="competition/publication-type">
        <SelectInput />
      </ReferenceInput>
      <NumberInput source="order" />
      <FileInput source="file" maxSize={10_485_760} accept={Accept.Pdf} isRequired={true}>
        <MyFileField />
      </FileInput>
    </SimpleForm>
  </MyEdit>
)

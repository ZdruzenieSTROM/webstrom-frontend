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
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzone-accept'

import {createPublicationFormData} from './createPublicationFormData'

export const PublicationEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createPublicationFormData(record)
      return record
    }}
  >
    <SimpleForm>
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

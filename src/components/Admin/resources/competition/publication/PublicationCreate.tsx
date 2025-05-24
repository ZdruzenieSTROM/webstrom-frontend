import {FC} from 'react'
import {
  AutocompleteInput,
  FileInput,
  NumberInput,
  ReferenceInput,
  required,
  SimpleForm,
  TextInput,
  useCreateContext,
} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzone-accept'

import {createPublicationFormData} from './createPublicationFormData'

export const PublicationCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createPublicationFormData(record)
      return record
    }}
  >
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <ReferenceInput source="event" reference="competition/event" defaultValue={4}>
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <NumberInput source="order" />
      <FileInput source="file" maxSize={10_485_760} accept={Accept.Pdf} isRequired={true}>
        <MyFileField />
      </FileInput>
    </SimpleForm>
  </MyCreate>
)

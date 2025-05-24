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
import {useSearchParams} from 'react-router-dom'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzone-accept'

import {createPublicationFormData} from './createPublicationFormData'

export const PublicationCreate: FC = () => {
  const [searchParams] = useSearchParams()

  return (
    <MyCreate
      transform={(record) => {
        record.formData = createPublicationFormData(record)
        return record
      }}
    >
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <ReferenceInput source="event" reference="competition/event">
          <AutocompleteInput
            optionText="verbose_name"
            validate={required()}
            defaultValue={searchParams.get('parent_id')}
          />
        </ReferenceInput>
        <ReferenceInput source="publication_type" reference="competition/publication-type">
          <SelectInput />
        </ReferenceInput>
        <NumberInput source="order" />
        <FileInput source="file" maxSize={10_485_760} accept={Accept.Pdf} isRequired={true}>
          <MyFileField />
        </FileInput>
      </SimpleForm>
    </MyCreate>
  )
}

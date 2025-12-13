import {FC} from 'react'
import {AutocompleteInput, NumberInput, ReferenceInput, required, SelectInput, SimpleForm, TextInput} from 'react-admin'
import {useSearchParams} from 'react-router-dom'

import {MyCreateFileInput} from '@/components/Admin/custom/file-handling/MyCreateFileInput'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {Accept} from '@/utils/dropzoneAccept'

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
      <SimpleForm toolbar={<MyCreateToolbar />}>
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
        <MyCreateFileInput source="file" maxSize={10_485_760} accept={Accept.Pdf} isRequired={true} />
      </SimpleForm>
    </MyCreate>
  )
}

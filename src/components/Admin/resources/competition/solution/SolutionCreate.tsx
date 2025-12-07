import {FC} from 'react'
import {AutocompleteInput, BooleanInput, FileInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {MyToolbar} from '@/components/Admin/custom/MyToolbar'
import {Accept} from '@/utils/dropzoneAccept'

import {createSolutionFormData} from './createSolutionFormData'

export const SolutionCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createSolutionFormData(record)
      return record
    }}
  >
    <SimpleForm toolbar={<MyToolbar />}>
      <ReferenceInput source="problem" reference="competition/problem">
        <AutocompleteInput validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="semester_registration" reference="competition/event-registration">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <FileInput source="solution" accept={Accept.Pdf}>
        <MyFileField />
      </FileInput>
      <ReferenceInput source="late_tag" reference="competition/late-tag">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="is_online" label="content.labels.is_online" />
    </SimpleForm>
  </MyCreate>
)

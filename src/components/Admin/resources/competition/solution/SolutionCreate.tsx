import {FC} from 'react'
import {AutocompleteInput, BooleanInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyCreateFileInput} from '@/components/Admin/custom/file-handling/MyCreateFileInput'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {Accept} from '@/utils/dropzoneAccept'

import {createSolutionFormData} from './createSolutionFormData'

export const SolutionCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createSolutionFormData(record)
      return record
    }}
  >
    <SimpleForm toolbar={<MyCreateToolbar dontResetFields={['semester_registration']} />}>
      <ReferenceInput source="problem" reference="competition/problem">
        <AutocompleteInput validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="semester_registration" reference="competition/event-registration">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <MyCreateFileInput source="solution" accept={Accept.Pdf} />
      <MyCreateFileInput source="corrected_solution" accept={Accept.Pdf} />
      <ReferenceInput source="late_tag" reference="competition/late-tag">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="is_online" label="content.labels.is_online" />
    </SimpleForm>
  </MyCreate>
)

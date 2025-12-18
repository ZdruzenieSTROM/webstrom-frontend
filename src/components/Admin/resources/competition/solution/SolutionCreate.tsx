import {FC} from 'react'
import {AutocompleteInput, BooleanInput, FileInput, ReferenceInput, SimpleForm} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzoneAccept'

import {createSolutionFormData} from './createSolutionFormData'
import {ProblemReferenceInput} from './ProblemReferenceInput'
import {SemesterRegistrationReferenceInput} from './SemesterRegistrationReferenceInput'

export const SolutionCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createSolutionFormData(record)
      return record
    }}
  >
    <SimpleForm toolbar={<MyCreateToolbar dontResetFields={['semester_registration']} />}>
      <SemesterRegistrationReferenceInput />
      <ProblemReferenceInput />
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

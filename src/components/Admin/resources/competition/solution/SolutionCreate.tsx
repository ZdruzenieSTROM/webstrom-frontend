import {FC} from 'react'
import {AutocompleteInput, BooleanInput, ReferenceInput, SimpleForm} from 'react-admin'

import {MyCreateFileInput} from '@/components/Admin/custom/file-handling/MyCreateFileInput'
import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyCreateToolbar} from '@/components/Admin/custom/MyCreateToolbar'
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
      <MyCreateFileInput source="solution" accept={Accept.Pdf} />
      <MyCreateFileInput source="corrected_solution" accept={Accept.Pdf} />
      <ReferenceInput source="late_tag" reference="competition/late-tag">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="is_online" label="content.labels.is_online" />
    </SimpleForm>
  </MyCreate>
)

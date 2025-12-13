import {FC} from 'react'
import {AutocompleteInput, BooleanInput, ReferenceInput, SimpleForm, useRecordContext} from 'react-admin'

import {MyEditFileInput} from '@/components/Admin/custom/file-handling/MyEditFileInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyEditToolbar} from '@/components/Admin/custom/MyEditToolbar'
import {Accept} from '@/utils/dropzoneAccept'
import {getCorrectedSolutionUrl, getSolutionUrl} from '@/utils/getSolutionUrl'

import {createSolutionFormData} from './createSolutionFormData'
import {ProblemReferenceInput} from './ProblemReferenceInput'
import {SemesterRegistrationReferenceInput} from './SemesterRegistrationReferenceInput'

export const SolutionEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createSolutionFormData(record)
      return record
    }}
  >
    <MySimpleForm />
  </MyEdit>
)

// kvoli tomu, ze `late_tag` pride z BE ako objekt, ale pri update posielame len IDcko
const MySimpleForm: FC = () => {
  const record = useRecordContext()

  return (
    <SimpleForm record={{...record, late_tag: record?.late_tag?.id}} toolbar={<MyEditToolbar />}>
      <SemesterRegistrationReferenceInput />
      <ProblemReferenceInput />
      <MyEditFileInput source="solution" accept={Accept.Pdf} reformatUrlFromId={getSolutionUrl} />
      <MyEditFileInput source="corrected_solution" accept={Accept.Pdf} reformatUrlFromId={getCorrectedSolutionUrl} />
      <ReferenceInput source="late_tag" reference="competition/late-tag">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="is_online" label="content.labels.is_online" />
    </SimpleForm>
  )
}

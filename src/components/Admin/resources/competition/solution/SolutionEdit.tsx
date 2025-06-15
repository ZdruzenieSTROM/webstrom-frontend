import {FC} from 'react'
import {
  AutocompleteInput,
  BooleanInput,
  FileInput,
  ReferenceInput,
  required,
  SimpleForm,
  useRecordContext,
} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzoneAccept'

import {createSolutionFormData} from './createSolutionFormData'

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
    <SimpleForm record={{...record, late_tag: record?.late_tag?.id}}>
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
  )
}

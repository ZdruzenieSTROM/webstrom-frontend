import {FC} from 'react'
import {AutocompleteInput, BooleanInput, FileInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {Accept} from '@/utils/dropzone-accept'

import {createSolutionFormData} from './createSolutionFormData'

export const SolutionEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      record.formData = createSolutionFormData(record)
      return record
    }}
  >
    <SimpleForm>
      <ReferenceInput source="problem" reference="competition/problem">
        <AutocompleteInput validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="semester_registration" reference="competition/event-registration">
        <AutocompleteInput optionText="verbose_name" validate={required()} />
      </ReferenceInput>
      <FileInput source="solution" accept={Accept.Pdf}>
        <MyFileField />
      </FileInput>
      <ReferenceInput source="late_tag" reference="competition/late-tag" label="content.labels.is_late">
        <AutocompleteInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="is_online" label="content.labels.is_online" />
    </SimpleForm>
  </MyEdit>
)

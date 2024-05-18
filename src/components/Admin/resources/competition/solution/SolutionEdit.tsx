import {FC} from 'react'
import {AutocompleteInput, FileInput, ReferenceInput, required, SimpleForm} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyFileField} from '@/components/Admin/custom/MyFileField'

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
        <AutocompleteInput fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="semester_registration" reference="competition/event-registration">
        <AutocompleteInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <FileInput source="solution" accept="application/pdf">
        <MyFileField />
      </FileInput>
    </SimpleForm>
  </MyEdit>
)

import {FC} from 'react'
import {
  AutocompleteInput,
  CheckboxGroupInput,
  DateTimeInput,
  FileInput,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyFileField} from '@/components/Admin/custom/MyFileField'

import {createSolutionFormData} from './createSolutionFormData'

export const SolutionCreate: FC = () => (
  <MyCreate
    transform={(record) => {
      record.formData = createSolutionFormData(record)
      return record
    }}
  >
    <SimpleForm>
      <ReferenceInput source="problem" reference="competition/problem">
        <SelectInput fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="semester_registration" reference="/competition/event-registration/">
        <SelectInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <FileInput source="solution" accept="application/pdf">
        <MyFileField />
      </FileInput>
    </SimpleForm>
  </MyCreate>
)

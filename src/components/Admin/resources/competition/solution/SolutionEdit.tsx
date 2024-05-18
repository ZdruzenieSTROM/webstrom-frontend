import {FC} from 'react'
import {
  AutocompleteInput,
  FileInput,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

import {MyEdit} from '@/components/Admin/custom/MyEdit'
import {MyFileField} from '@/components/Admin/custom/MyFileField'
import {SitesCheckboxInput} from '@/components/Admin/custom/SitesCheckboxInput'

export const SolutionEdit: FC = () => (
  <MyEdit>
    <SimpleForm>
      <ReferenceInput source="problem" reference="competition/problem">
        <SelectInput fullWidth validate={required()} />
      </ReferenceInput>
      <ReferenceInput source="semester_registration" reference="competition/event-registration">
        <SelectInput optionText="verbose_name" fullWidth validate={required()} />
      </ReferenceInput>
      <FileInput source="solution" accept="application/pdf">
        <MyFileField />
      </FileInput>
    </SimpleForm>
  </MyEdit>
)

import {FC} from 'react'
import {
  CheckboxGroupInput,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
} from 'react-admin'

import {MyCreate} from '@/components/Admin/custom/MyCreate'
import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'

import {seasonCodeStrings} from '../../../seasonCodeStrings'

export const SemesterCreate: FC = () => (
  <MyCreate>
    <SimpleForm>
      <ReferenceInput source="competition" reference="competition/competition">
        <SelectInput validate={required()} />
      </ReferenceInput>
      <NumberInput source="year" helperText="ročník súťaže, napr. 48" validate={required()} />
      <SelectInput source="season_code" choices={seasonCodeStrings} validate={required()} />
      <TextInput source="school_year" helperText="napr. 2023/2024" />
      <MyDateTimeInput source="start" validate={required()} />
      <MyDateTimeInput source="end" validate={required()} />
      <TextInput source="additional_name" />
      {/* nechavam viditelne disabled nech sa rozhodneme, co s tym. BE nam posiela ID, 
          neviem, ci vieme updatnut cely objekt tym, ze ho pribalim, ako v EventEdit...
          uvidime, ci ten field vobec potrebujeme */}
      <NumberInput source="registration_link" disabled />
      <ReferenceArrayInput
        source="late_tags"
        reference="competition/late-tag"
        helperText="Ako neskoro po termíne môže riešiteľ odovzdávať?"
      >
        <CheckboxGroupInput />
      </ReferenceArrayInput>
    </SimpleForm>
  </MyCreate>
)

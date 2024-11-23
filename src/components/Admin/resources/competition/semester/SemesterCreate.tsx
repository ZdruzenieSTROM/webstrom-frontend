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

export const SemesterCreate: FC = () => {
  const season_code_strings = [
    {id: 0, name: 'Zimný'},
    {id: 1, name: 'Letný'},
    {id: 2, name: 'Iný'},
  ]

  return (
    <MyCreate>
      <SimpleForm>
        <ReferenceInput source="competition" reference="competition/competition">
          <SelectInput fullWidth validate={required()} />
        </ReferenceInput>
        <NumberInput source="year" helperText="ročník súťaže, napr. 48" fullWidth validate={required()} />
        <SelectInput source="season_code" choices={season_code_strings} fullWidth validate={required()} />
        <TextInput source="school_year" helperText="napr. 2023/2024" fullWidth />
        <MyDateTimeInput source="start" fullWidth validate={required()} />
        <MyDateTimeInput source="end" fullWidth validate={required()} />
        <TextInput source="additional_name" fullWidth />
        {/* nechavam viditelne disabled nech sa rozhodneme, co s tym. BE nam posiela ID, 
          neviem, ci vieme updatnut cely objekt tym, ze ho pribalim, ako v EventEdit...
          uvidime, ci ten field vobec potrebujeme */}
        <NumberInput source="registration_link" fullWidth disabled />
        <ReferenceArrayInput source="late_tags" reference="competition/late-tag">
          <CheckboxGroupInput />
        </ReferenceArrayInput>
      </SimpleForm>
    </MyCreate>
  )
}

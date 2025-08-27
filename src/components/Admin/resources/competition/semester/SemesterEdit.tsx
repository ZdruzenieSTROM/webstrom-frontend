import {FC} from 'react'
import {
  CheckboxGroupInput,
  FormTab,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  required,
  SelectInput,
  TabbedForm,
  TextInput,
} from 'react-admin'

import {MyDateTimeInput} from '@/components/Admin/custom/MyDateTimeInput'
import {MyEdit} from '@/components/Admin/custom/MyEdit'

import {seasonCodeStrings} from '../../../seasonCodeStrings'

export const SemesterEdit: FC = () => (
  <MyEdit
    transform={(record) => {
      // automaticky sa na BE posiela cely record, ale BE read_only (aj neexistujuce) fieldy ignoruje
      // radsej z payloadu odstranime aspon sety
      delete record.publication_set
      delete record.series_set
      return record
    }}
  >
    <TabbedForm>
      <FormTab label="content.labels.general">
        <ReferenceInput source="competition" reference="competition/competition">
          <SelectInput validate={required()} />
        </ReferenceInput>
        <NumberInput source="year" helperText="ročník súťaže, napr. 48" />
        <SelectInput source="season_code" choices={seasonCodeStrings} validate={required()} />
        <TextInput source="school_year" helperText="napr. 2023/2024" />
        <MyDateTimeInput source="start" />
        <MyDateTimeInput source="end" />
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
      </FormTab>
    </TabbedForm>
  </MyEdit>
)
